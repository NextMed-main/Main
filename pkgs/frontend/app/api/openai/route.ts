import { type NextRequest, NextResponse } from "next/server";
import {
  generateAIContext,
  getEHRStatistics,
  searchRecords,
} from "@/lib/ehr-data-service";
import OpenAI from "openai";

/**
 * OpenAI API Route for Researchers
 *
 * This endpoint processes natural language queries from researchers
 * and uses OpenAI GPT models to analyze EHR (Electronic Health Record) data.
 *
 * Security: API key is kept server-side, never exposed to client.
 */

const SYSTEM_PROMPT_TEMPLATE = `# Identity
You are the NextMed AI Research Assistant, a specialized clinical data analyst. Your goal is to help researchers explore and gain insights from the Electronic Health Record (EHR) database while maintaining the highest standards of data privacy and clinical accuracy.

# Context Data
The following data represents anonymized, aggregated statistics and sample records from the NextMed EHR database (300,000+ total records). Use this as your primary source of truth for all analyses.

<database_context>
{{EHR_CONTEXT}}
</database_context>

# Instructions
1. **Clinical Analysis**: Provide evidence-based responses derived strictly from the provided statistics. Calculate percentages, trends, and comparisons when requested.
2. **Data Privacy**: Emphasize that all data is anonymized and de-identified. Never imply access to real-world identifiable patient information.
3. **Structured Reporting**: Use Markdown to structure your findings (headers, bullet points, tables). This makes the data easier for researchers to digest.
4. **Transparency**: Always mention sample sizes or total record counts when discussing prevalence or rates. If a query cannot be answered by the available data, clearly state the limitations.
5. **Insight Generation**: Highlight notable patterns, outliers, or demographic correlations. Suggest relevant follow-up questions to deepen the researcher's exploration.

# Constraints
- Do not hallucinate statistics. If the data isn't in the <database_context>, do not invent it.
- Maintain a professional, clinical, and objective tone.
- Ensure all responses are formatted for high readability in a research dashboard.

# Example Interaction
<user_query>
What is the prevalence of hypertension in patients over 60?
</user_query>
<assistant_response>
### Hypertension Prevalence: Patients 60+
Based on the current EHR database (300,000+ records):

- **Age Group 60-74**: Found in 12,450 patients (~18% of this group).
- **Age Group 75+**: Found in 8,200 patients (~22% of this group).

**Key Insight**: Prevalence increases significantly after age 75, matching global geriatric trends.
</assistant_response>`;

interface OpenAIRequest {
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

interface OpenAIResponse {
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
    const body: OpenAIRequest = await request.json();
    const { query, conversationHistory = [], filters } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required and must be a non-empty string",
        } as OpenAIResponse,
        { status: 400 },
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY environment variable is not set");
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API is not configured. Please set OPENAI_API_KEY environment variable.",
        } as OpenAIResponse,
        { status: 500 },
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    // Generate context from actual EHR data
    let ehrContext = await generateAIContext();

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

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "developer", content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of conversationHistory) {
      messages.push({
        role: (msg.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: msg.content,
      });
    }

    // Add current query with delimiters
    messages.push({ role: "user", content: `<user_query>\n${query}\n</user_query>` });

    // Request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o as a powerful default
      messages,
      temperature: 0.1,
      max_tokens: 2048,
    });

    const responseText = completion.choices[0]?.message?.content || "I apologize, but I was unable to generate a response.";

    // Get stats for response metadata
    const stats = await getEHRStatistics();
    const queryTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      response: responseText,
      tokensUsed: completion.usage?.total_tokens,
      dataStats: {
        totalRecords: stats.totalRecords,
        queryTime,
      },
    } as OpenAIResponse);

  } catch (error) {
    console.error("Error processing OpenAI request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      } as OpenAIResponse,
      { status: 500 },
    );
  }
}

// GET endpoint for health check and data summary
export async function GET(): Promise<NextResponse> {
  const hasApiKey = !!process.env.OPENAI_API_KEY;

  try {
    const stats = await getEHRStatistics();

    return NextResponse.json({
      status: "ok",
      service: "NextMed EHR Research Assistant (OpenAI)",
      configured: hasApiKey,
      dataSource: "/public/demo-data/nextmed_ehr_demo_300k.csv",
      statistics: {
        totalRecords: stats.totalRecords,
        totalVisits: stats.visitStats.totalVisits,
        avgVisitsPerPatient: stats.visitStats.avgVisitsPerPatient,
        regionsCount: Object.keys(stats.demographics.regionDistribution).length,
        conditionsTracked: Object.keys(stats.conditions.chronicConditions).length,
        medicationsTracked: Object.keys(stats.medications.topMedications).length,
      },
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
