import { type NextRequest, NextResponse } from "next/server";
import {
  type EHRRecord,
  getEHRStatistics,
  loadEHRData,
  searchRecords,
} from "@/lib/ehr-data-service";

/**
 * EHR Query API Route
 *
 * This endpoint processes filter and SQL-like queries against the EHR dataset.
 * It does NOT use AI - it directly queries the data.
 */

interface FilterRequest {
  type: "filter";
  filters: {
    ageMin?: number;
    ageMax?: number;
    condition?: string;
    medication?: string;
    region?: string;
    gender?: string;
    diagnosis?: string;
  };
  limit?: number;
}

interface SQLRequest {
  type: "sql";
  query: string;
}

interface AggregateRequest {
  type: "aggregate";
  groupBy: "age" | "gender" | "region" | "condition" | "medication";
  filter?: {
    condition?: string;
    region?: string;
    gender?: string;
  };
}

type QueryRequest = FilterRequest | SQLRequest | AggregateRequest;

interface QueryResponse {
  success: boolean;
  data?: {
    records?: EHRRecord[];
    aggregations?: Record<string, number>;
    stats?: {
      totalMatched: number;
      queryTime: number;
    };
  };
  error?: string;
}

/**
 * Parse a simple SQL-like query (limited syntax)
 * Supports: SELECT, FROM, WHERE, GROUP BY, LIMIT
 */
function parseSimpleSQL(query: string): {
  select: string[];
  where: Record<string, string>;
  groupBy?: string;
  limit?: number;
} {
  const result: {
    select: string[];
    where: Record<string, string>;
    groupBy?: string;
    limit?: number;
  } = {
    select: ["*"],
    where: {},
  };

  // Normalize query
  const normalizedQuery = query.trim();

  // Extract SELECT fields
  const selectMatch = normalizedQuery.match(/SELECT\s+(.+?)\s+FROM/i);
  if (selectMatch) {
    result.select = selectMatch[1].split(",").map((s) => s.trim());
  }

  // Extract WHERE conditions
  const whereMatch = normalizedQuery.match(
    /WHERE\s+(.+?)(?:\s+GROUP|\s+ORDER|\s+LIMIT|$)/i,
  );
  if (whereMatch) {
    const conditions = whereMatch[1].split(/\s+AND\s+/i);
    for (const condition of conditions) {
      const eqMatch = condition.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/i);
      if (eqMatch) {
        result.where[eqMatch[1].toLowerCase()] = eqMatch[2];
      }
      const likeMatch = condition.match(
        /(\w+)\s+LIKE\s+['"]?%?([^'"]+)%?['"]?/i,
      );
      if (likeMatch) {
        result.where[likeMatch[1].toLowerCase()] = likeMatch[2];
      }
    }
  }

  // Extract GROUP BY
  const groupMatch = normalizedQuery.match(/GROUP\s+BY\s+(\w+)/i);
  if (groupMatch) {
    result.groupBy = groupMatch[1].toLowerCase();
  }

  // Extract LIMIT
  const limitMatch = normalizedQuery.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    result.limit = Number.parseInt(limitMatch[1], 10);
  }

  return result;
}

/**
 * Get age group from age
 */
function getAgeGroup(age: number): string {
  if (age < 20) return "0-19";
  if (age < 40) return "20-39";
  if (age < 60) return "40-59";
  if (age < 80) return "60-79";
  return "80+";
}

/**
 * Execute a filter-based query
 */
async function executeFilterQuery(
  request: FilterRequest,
): Promise<QueryResponse> {
  const startTime = Date.now();
  const { filters, limit = 100 } = request;

  try {
    // Convert age range to min/max
    let ageMin: number | undefined;
    let ageMax: number | undefined;

    if (filters.ageMin !== undefined) ageMin = filters.ageMin;
    if (filters.ageMax !== undefined) ageMax = filters.ageMax;

    const records = await searchRecords({
      condition:
        filters.condition && filters.condition !== "all"
          ? filters.condition
          : undefined,
      medication:
        filters.medication && filters.medication !== "all"
          ? filters.medication
          : undefined,
      region:
        filters.region && filters.region !== "all" ? filters.region : undefined,
      gender:
        filters.gender && filters.gender !== "all" ? filters.gender : undefined,
      diagnosis:
        filters.diagnosis && filters.diagnosis !== "all"
          ? filters.diagnosis
          : undefined,
      ageMin,
      ageMax,
      limit,
    });

    return {
      success: true,
      data: {
        records,
        stats: {
          totalMatched: records.length,
          queryTime: Date.now() - startTime,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Filter query failed",
    };
  }
}

/**
 * Execute an aggregation query
 */
async function executeAggregateQuery(
  request: AggregateRequest,
): Promise<QueryResponse> {
  const startTime = Date.now();
  const { groupBy, filter } = request;

  try {
    const allRecords = await loadEHRData();
    let filteredRecords = allRecords;

    // Apply filters
    if (filter?.condition) {
      const condLower = filter.condition.toLowerCase();
      filteredRecords = filteredRecords.filter((r) =>
        r.symptoms.some((s) => s.toLowerCase().includes(condLower)),
      );
    }
    if (filter?.region) {
      const regLower = filter.region.toLowerCase();
      filteredRecords = filteredRecords.filter((r) =>
        r.region.toLowerCase().includes(regLower),
      );
    }
    if (filter?.gender) {
      filteredRecords = filteredRecords.filter(
        (r) => r.gender.toLowerCase() === filter.gender?.toLowerCase(),
      );
    }

    // Perform aggregation
    const aggregations: Record<string, number> = {};

    for (const record of filteredRecords) {
      let key: string;

      switch (groupBy) {
        case "age":
          key = getAgeGroup(record.age);
          break;
        case "gender":
          key = record.gender;
          break;
        case "region":
          key = record.region;
          break;
        case "condition":
          // Multiple conditions per record
          for (const cond of record.symptoms) {
            aggregations[cond] = (aggregations[cond] || 0) + 1;
          }
          continue;
        case "medication":
          // Multiple medications per record
          for (const med of record.medicationHistory) {
            aggregations[med] = (aggregations[med] || 0) + 1;
          }
          continue;
        default:
          key = "unknown";
      }

      aggregations[key] = (aggregations[key] || 0) + 1;
    }

    // Sort by count descending
    const sortedAggregations = Object.fromEntries(
      Object.entries(aggregations).sort((a, b) => b[1] - a[1]),
    );

    return {
      success: true,
      data: {
        aggregations: sortedAggregations,
        stats: {
          totalMatched: filteredRecords.length,
          queryTime: Date.now() - startTime,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Aggregate query failed",
    };
  }
}

/**
 * Execute a SQL-like query
 */
async function executeSQLQuery(request: SQLRequest): Promise<QueryResponse> {
  const startTime = Date.now();

  try {
    const parsed = parseSimpleSQL(request.query);
    const allRecords = await loadEHRData();
    let filteredRecords = allRecords;

    // Apply WHERE conditions
    if (parsed.where.age) {
      const age = Number.parseInt(parsed.where.age, 10);
      filteredRecords = filteredRecords.filter((r) => r.age === age);
    }
    if (parsed.where.age_group || parsed.where.agegroup) {
      const ageGroup = parsed.where.age_group || parsed.where.agegroup;
      filteredRecords = filteredRecords.filter(
        (r) => getAgeGroup(r.age) === ageGroup,
      );
    }
    if (parsed.where.gender) {
      filteredRecords = filteredRecords.filter(
        (r) => r.gender.toLowerCase() === parsed.where.gender.toLowerCase(),
      );
    }
    if (parsed.where.region) {
      const regLower = parsed.where.region.toLowerCase();
      filteredRecords = filteredRecords.filter((r) =>
        r.region.toLowerCase().includes(regLower),
      );
    }
    if (parsed.where.condition || parsed.where.symptom) {
      const cond = (
        parsed.where.condition || parsed.where.symptom
      ).toLowerCase();
      filteredRecords = filteredRecords.filter((r) =>
        r.symptoms.some((s) => s.toLowerCase().includes(cond)),
      );
    }
    if (parsed.where.medication) {
      const med = parsed.where.medication.toLowerCase();
      filteredRecords = filteredRecords.filter((r) =>
        r.medicationHistory.some((m) => m.toLowerCase().includes(med)),
      );
    }

    // Handle GROUP BY
    if (parsed.groupBy) {
      const aggregations: Record<string, number> = {};

      for (const record of filteredRecords) {
        let key: string;

        switch (parsed.groupBy) {
          case "age_group":
          case "agegroup":
          case "age":
            key = getAgeGroup(record.age);
            break;
          case "gender":
            key = record.gender;
            break;
          case "region":
            key = record.region;
            break;
          default:
            key = "unknown";
        }

        aggregations[key] = (aggregations[key] || 0) + 1;
      }

      return {
        success: true,
        data: {
          aggregations,
          stats: {
            totalMatched: filteredRecords.length,
            queryTime: Date.now() - startTime,
          },
        },
      };
    }

    // Apply LIMIT
    const limit = parsed.limit || 100;
    const limitedRecords = filteredRecords.slice(0, limit);

    return {
      success: true,
      data: {
        records: limitedRecords,
        stats: {
          totalMatched: filteredRecords.length,
          queryTime: Date.now() - startTime,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "SQL query failed",
    };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: QueryRequest = await request.json();

    if (!body.type) {
      return NextResponse.json(
        { success: false, error: "Query type is required" },
        { status: 400 },
      );
    }

    let response: QueryResponse;

    switch (body.type) {
      case "filter":
        response = await executeFilterQuery(body);
        break;
      case "sql":
        response = await executeSQLQuery(body);
        break;
      case "aggregate":
        response = await executeAggregateQuery(body);
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid query type" },
          { status: 400 },
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Query failed",
      },
      { status: 500 },
    );
  }
}

// GET endpoint for stats
export async function GET(): Promise<NextResponse> {
  try {
    const stats = await getEHRStatistics();

    return NextResponse.json({
      success: true,
      statistics: stats,
      capabilities: [
        "Filter by age, gender, region, condition, medication",
        "SQL-like queries with SELECT, WHERE, GROUP BY, LIMIT",
        "Aggregation by age group, gender, region, condition",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get stats",
      },
      { status: 500 },
    );
  }
}
