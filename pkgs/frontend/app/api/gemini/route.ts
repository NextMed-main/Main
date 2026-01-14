import { type NextRequest, NextResponse } from "next/server";
import {
  generateGeminiContext,
  getEHRStatistics,
  searchRecords,
} from "@/lib/ehr-data-service";

/**
 * Gemini API Route for Researchers
 *
 * This endpoint processes natural language queries from researchers
 * and uses Gemini AI to analyze EHR (Electronic Health Record) data.
 *
 * Security: API key is kept server-side, never exposed to client.
 *
 * Data Source: Reads from /public/demo-data/nextmed_ehr_demo_300k.csv
 * - 300,000 patient records
 * - Includes demographics, conditions, medications, visit history
 */

// System prompt for Gemini to act as an EHR research assistant
const SYSTEM_PROMPT_TEMPLATE = `You are an AI research assistant specialized in analyzing Electronic Health Record (EHR) data for the NextMed platform.

You have access to a comprehensive EHR database with the following statistics and sample data:

{{EHR_CONTEXT}}

IMPORTANT GUIDELINES:
1. You are helping researchers analyze this anonymized EHR data using natural language queries.
2. Always provide accurate, evidence-based responses derived from the available statistics.
3. When discussing patient data, emphasize privacy protection - data shown is anonymized/de-identified.
4. Calculate percentages, rates, and comparisons based on the statistics provided.
5. For demographic queries, use the age, gender, and region distribution data.
6. For condition prevalence, use the chronic conditions and diagnoses data.
7. For medication insights, use the medication distribution data.
8. Format responses in a clear, structured manner suitable for healthcare researchers.
9. Use markdown formatting for better readability (headers, lists, bold text, tables when appropriate).
10. When appropriate, suggest follow-up analyses or related insights.
11. If a query asks for information not in the dataset, clearly state the limitation.
12. Always provide context about sample sizes when discussing statistics.
13. Highlight any notable patterns or outliers in the data.

AVAILABLE DATA:
- Patient demographics: age, gender, region
- Chronic conditions: hypertension, diabetes, GERD, depression, asthma, etc.
- Medications: common prescriptions and their prevalence
- Visit history: diagnoses from past medical encounters
- Geographic coverage: Japan, UK, USA

Remember: You are analyzing REAL aggregated EHR data. Be precise and clinically relevant in your responses.`;

interface GeminiRequest {
  query: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  filters?: {
    condition?: string;
    medication?: string;
    region?: string;
    ageMin?: number;
    ageMax?: number;
    gender?: string;
  };
}

interface GeminiResponse {
  success: boolean;
  response?: string;
  error?: string;
  tokensUsed?: number;
  dataStats?: {
    totalRecords: number;
    queryTime: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const body: GeminiRequest = await request.json();
    const { query, conversationHistory = [], filters } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required and must be a non-empty string",
        } as GeminiResponse,
        { status: 400 },
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set");
      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini API is not configured. Please set GEMINI_API_KEY environment variable.",
        } as GeminiResponse,
        { status: 500 },
      );
    }

    // Generate context from actual EHR data
    let ehrContext = await generateGeminiContext();

    // If filters are provided, add filtered sample data
    if (
      filters &&
      Object.keys(filters).some((k) => filters[k as keyof typeof filters])
    ) {
      const filteredRecords = await searchRecords({
        ...filters,
        limit: 10,
      });

      if (filteredRecords.length > 0) {
        ehrContext += `\n\n### Filtered Sample Records (based on query context)\n`;
        ehrContext += `Found ${filteredRecords.length} matching records. Sample:\n`;
        for (const r of filteredRecords.slice(0, 5)) {
          ehrContext += `\n- **${r.fullName}** (${r.age}y, ${r.gender}, ${r.region})`;
          ehrContext += `\n  Conditions: ${r.symptoms.join(", ") || "None"}`;
          ehrContext += `\n  Medications: ${r.medicationHistory.join(", ") || "None"}`;
        }
      }
    }

    // Build system prompt with EHR context
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
      "{{EHR_CONTEXT}}",
      ehrContext,
    );

    // Gemini API endpoint
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Build conversation contents for Gemini
    const contents = [];

    // Add conversation history if present
    for (const msg of conversationHistory) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Add the current user query
    contents.push({
      role: "user",
      parts: [{ text: query }],
    });

    // Make request to Gemini API
    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Gemini API returned an error: ${geminiResponse.status}`,
        } as GeminiResponse,
        { status: 502 },
      );
    }

    const geminiData = await geminiResponse.json();

    // Extract the response text
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I was unable to generate a response. Please try rephrasing your query.";

    // Calculate approximate tokens used
    const tokensUsed =
      geminiData.usageMetadata?.totalTokenCount ||
      Math.ceil((query.length + responseText.length) / 4);

    // Get stats for response metadata
    const stats = await getEHRStatistics();
    const queryTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      response: responseText,
      tokensUsed,
      dataStats: {
        totalRecords: stats.totalRecords,
        queryTime,
      },
    } as GeminiResponse);
  } catch (error) {
    console.error("Error processing Gemini request:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      } as GeminiResponse,
      { status: 500 },
    );
  }
}

// GET endpoint for health check and data summary
export async function GET(): Promise<NextResponse> {
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  try {
    const stats = await getEHRStatistics();

    return NextResponse.json({
      status: "ok",
      service: "NextMed EHR Research Assistant",
      configured: hasApiKey,
      dataSource: "/public/demo-data/nextmed_ehr_demo_300k.csv",
      statistics: {
        totalRecords: stats.totalRecords,
        totalVisits: stats.visitStats.totalVisits,
        avgVisitsPerPatient: stats.visitStats.avgVisitsPerPatient,
        regionsCount: Object.keys(stats.demographics.regionDistribution).length,
        conditionsTracked: Object.keys(stats.conditions.chronicConditions)
          .length,
        medicationsTracked: Object.keys(stats.medications.topMedications)
          .length,
      },
      capabilities: [
        "Natural language EHR data queries",
        "Demographic analysis (age, gender, region)",
        "Condition prevalence insights",
        "Medication usage patterns",
        "Visit history analysis",
        "Cross-regional comparisons",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        configured: hasApiKey,
        error: error instanceof Error ? error.message : "Failed to load data",
      },
      { status: 500 },
    );
  }
}
