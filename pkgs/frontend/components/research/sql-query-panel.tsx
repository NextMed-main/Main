"use client";

import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Database,
  Download,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

/**
 * EHR Record interface matching the API response
 */
interface EHRRecord {
  fullName: string;
  age: number;
  gender: string;
  region: string;
  address: string;
  symptoms: string[];
  medicationHistory: string[];
  pastVisits: { date: string; diagnosis: string }[];
  phoneNumber: string;
  insuranceId: string;
}

interface QueryStats {
  totalMatched: number;
  queryTime: number;
}

/**
 * Example SQL queries for researchers
 */
const EXAMPLE_QUERIES = [
  {
    label: "Count by Age Group",
    query: `SELECT age_group, COUNT(*) as count
FROM ehr_records
GROUP BY age_group`,
  },
  {
    label: "Hypertension by Region",
    query: `SELECT region, COUNT(*) as count
FROM ehr_records
WHERE condition = 'Hypertension'
GROUP BY region`,
  },
  {
    label: "Female Patients with Diabetes",
    query: `SELECT *
FROM ehr_records
WHERE gender = 'Female'
AND condition = 'Diabetes'
LIMIT 50`,
  },
  {
    label: "Patients on Metformin",
    query: `SELECT *
FROM ehr_records
WHERE medication = 'Metformin'
LIMIT 50`,
  },
];

/**
 * SQL Query Panel Component
 *
 * Allows researchers to write SQL-like queries against the EHR dataset.
 * Supports SELECT, WHERE, GROUP BY, and LIMIT clauses.
 */
export function SQLQueryPanel() {
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0].query);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<EHRRecord[]>([]);
  const [aggregations, setAggregations] = useState<Record<
    string,
    number
  > | null>(null);
  const [stats, setStats] = useState<QueryStats | null>(null);
  const [showAllRecords, setShowAllRecords] = useState(false);

  /**
   * Execute the SQL query
   */
  const handleExecuteQuery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecords([]);
    setAggregations(null);

    try {
      const response = await fetch("/api/ehr-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sql",
          query,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Query failed");
      }

      if (data.data.aggregations) {
        setAggregations(data.data.aggregations);
      } else if (data.data.records) {
        setRecords(data.data.records);
      }

      setStats(data.data.stats || null);
      setShowAllRecords(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRecords([]);
      setAggregations(null);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  /**
   * Copy query to clipboard
   */
  const handleCopyQuery = useCallback(() => {
    navigator.clipboard.writeText(query);
  }, [query]);

  /**
   * Export results to CSV
   */
  const handleExport = useCallback(() => {
    let csvContent = "";

    if (aggregations) {
      csvContent = "Group,Count\n";
      for (const [key, value] of Object.entries(aggregations)) {
        csvContent += `"${key}",${value}\n`;
      }
    } else if (records.length > 0) {
      const headers = [
        "Name",
        "Age",
        "Gender",
        "Region",
        "Conditions",
        "Medications",
      ];
      csvContent = `${headers.join(",")}\n`;

      for (const record of records) {
        csvContent += `${[
          `"${record.fullName}"`,
          record.age,
          record.gender,
          `"${record.region}"`,
          `"${record.symptoms.join("; ")}"`,
          `"${record.medicationHistory.join("; ")}"`,
        ].join(",")}\n`;
      }
    }

    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ehr_sql_results_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records, aggregations]);

  const displayedRecords = showAllRecords ? records : records.slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Query Editor */}
      <Card className="p-4 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-600" />
            <span className="font-medium">SQL Query Editor</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyQuery}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>

        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="font-mono text-sm min-h-[140px] bg-slate-900 text-emerald-300 border-slate-700"
          placeholder="Write your SQL query here..."
        />

        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
          <strong>Supported syntax:</strong> SELECT, FROM ehr_records, WHERE
          (gender, region, condition, medication, age), GROUP BY (age_group,
          gender, region), LIMIT
        </div>

        {/* Example Queries */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase">
            Example Queries
          </span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((ex) => (
              <Button
                key={ex.label}
                variant="outline"
                size="sm"
                onClick={() => setQuery(ex.query)}
                className="text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {ex.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Execute Button */}
        <Button
          onClick={handleExecuteQuery}
          disabled={isLoading || !query.trim()}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Executing Query...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Execute SQL Query
            </>
          )}
        </Button>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Results */}
      {stats && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Database className="h-4 w-4" />
                <span className="font-medium">
                  {stats.totalMatched.toLocaleString()}
                </span>
                <span className="text-sm">records matched</span>
              </div>
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-300"
              >
                {stats.queryTime}ms
              </Badge>
            </div>
            {(records.length > 0 || aggregations) && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>

          {/* Aggregation Results */}
          {aggregations && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Aggregation Results</span>
              </div>

              <div className="space-y-2">
                {Object.entries(aggregations)
                  .slice(0, showAllRecords ? undefined : 10)
                  .map(([key, value]) => {
                    const maxValue = Math.max(...Object.values(aggregations));
                    const percentage = (value / maxValue) * 100;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{key}</span>
                          <span className="text-slate-500">
                            {value.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {Object.keys(aggregations).length > 10 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllRecords(!showAllRecords)}
                  >
                    {showAllRecords ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show All {Object.keys(aggregations).length} Groups
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Records Table */}
          {records.length > 0 && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-600">
                        Name
                      </th>
                      <th className="text-left p-3 font-medium text-slate-600">
                        Age
                      </th>
                      <th className="text-left p-3 font-medium text-slate-600">
                        Gender
                      </th>
                      <th className="text-left p-3 font-medium text-slate-600">
                        Region
                      </th>
                      <th className="text-left p-3 font-medium text-slate-600">
                        Conditions
                      </th>
                      <th className="text-left p-3 font-medium text-slate-600">
                        Medications
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedRecords.map((record, idx) => (
                      <tr
                        key={`${record.insuranceId}-${idx}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="p-3 font-medium">{record.fullName}</td>
                        <td className="p-3">{record.age}</td>
                        <td className="p-3">{record.gender}</td>
                        <td className="p-3">{record.region}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {record.symptoms.slice(0, 2).map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                            {record.symptoms.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{record.symptoms.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {record.medicationHistory.slice(0, 2).map((m) => (
                              <Badge
                                key={m}
                                variant="outline"
                                className="text-xs bg-blue-50"
                              >
                                {m}
                              </Badge>
                            ))}
                            {record.medicationHistory.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{record.medicationHistory.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Show More/Less */}
              {records.length > 10 && (
                <div className="p-3 border-t bg-slate-50 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllRecords(!showAllRecords)}
                  >
                    {showAllRecords ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show All {records.length} Records
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* No Results */}
          {records.length === 0 &&
            !aggregations &&
            stats.totalMatched === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No records match your query</p>
                <p className="text-sm mt-1">Try modifying your SQL query</p>
              </div>
            )}
        </div>
      )}

      {/* Initial State */}
      {!stats && !error && (
        <div className="text-center py-8 text-slate-500">
          <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Write a SQL query and click "Execute" to search</p>
          <p className="text-sm mt-1">Query 300,000 patient records</p>
        </div>
      )}
    </div>
  );
}

export default SQLQueryPanel;
