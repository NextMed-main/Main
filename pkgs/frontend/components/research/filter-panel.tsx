"use client";

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  Filter,
  Loader2,
  RefreshCcw,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
 * Filters Panel Component
 *
 * Allows researchers to filter and search EHR data using dropdown filters.
 * Queries the actual CSV data through the API.
 */
export function FilterPanel() {
  // Filter state
  const [ageRange, setAgeRange] = useState("all");
  const [condition, setCondition] = useState("all");
  const [medication, setMedication] = useState("all");
  const [region, setRegion] = useState("all");
  const [gender, setGender] = useState("all");

  // Results state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<EHRRecord[]>([]);
  const [stats, setStats] = useState<QueryStats | null>(null);
  const [showAllRecords, setShowAllRecords] = useState(false);

  /**
   * Execute the filter query
   */
  const handleApplyFilters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse age range to min/max
      let ageMin: number | undefined;
      let ageMax: number | undefined;

      if (ageRange !== "all") {
        const [min, max] = ageRange
          .split("-")
          .map((n) => Number.parseInt(n, 10));
        ageMin = min;
        ageMax = max || 120;
      }

      const response = await fetch("/api/ehr-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "filter",
          filters: {
            ageMin,
            ageMax,
            condition: condition !== "all" ? condition : undefined,
            medication: medication !== "all" ? medication : undefined,
            region: region !== "all" ? region : undefined,
            gender: gender !== "all" ? gender : undefined,
          },
          limit: 100,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Query failed");
      }

      setRecords(data.data.records || []);
      setStats(data.data.stats || null);
      setShowAllRecords(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRecords([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [ageRange, condition, medication, region, gender]);

  /**
   * Reset all filters
   */
  const handleReset = useCallback(() => {
    setAgeRange("all");
    setCondition("all");
    setMedication("all");
    setRegion("all");
    setGender("all");
    setRecords([]);
    setStats(null);
    setError(null);
  }, []);

  /**
   * Export results to CSV
   */
  const handleExport = useCallback(() => {
    if (records.length === 0) return;

    const headers = [
      "Name",
      "Age",
      "Gender",
      "Region",
      "Conditions",
      "Medications",
    ];
    const csvRows = [headers.join(",")];

    for (const record of records) {
      csvRows.push(
        [
          `"${record.fullName}"`,
          record.age,
          record.gender,
          `"${record.region}"`,
          `"${record.symptoms.join("; ")}"`,
          `"${record.medicationHistory.join("; ")}"`,
        ].join(","),
      );
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ehr_filter_results_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records]);

  const displayedRecords = showAllRecords ? records : records.slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <Card className="p-4 bg-white">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Age Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Age Range</Label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-17">0-17 years</SelectItem>
                <SelectItem value="18-29">18-29 years</SelectItem>
                <SelectItem value="30-44">30-44 years</SelectItem>
                <SelectItem value="45-59">45-59 years</SelectItem>
                <SelectItem value="60-74">60-74 years</SelectItem>
                <SelectItem value="75-120">75+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Chronic Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Hypertension">Hypertension</SelectItem>
                <SelectItem value="Diabetes">Diabetes</SelectItem>
                <SelectItem value="GERD">GERD</SelectItem>
                <SelectItem value="Depression">Depression</SelectItem>
                <SelectItem value="Asthma">Asthma</SelectItem>
                <SelectItem value="Chronic Pain">Chronic Pain</SelectItem>
                <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                <SelectItem value="Anxiety">Anxiety</SelectItem>
                <SelectItem value="Arthritis">Arthritis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medication */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Medication</Label>
            <Select value={medication} onValueChange={setMedication}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Select medication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Medications</SelectItem>
                <SelectItem value="Atorvastatin">Atorvastatin</SelectItem>
                <SelectItem value="Metformin">Metformin</SelectItem>
                <SelectItem value="Amlodipine">Amlodipine</SelectItem>
                <SelectItem value="Omeprazole">Omeprazole</SelectItem>
                <SelectItem value="Sertraline">Sertraline</SelectItem>
                <SelectItem value="Lisinopril">Lisinopril</SelectItem>
                <SelectItem value="Albuterol">Albuterol</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Kanto">Kanto (Japan)</SelectItem>
                <SelectItem value="Kansai">Kansai (Japan)</SelectItem>
                <SelectItem value="Hokkaido">Hokkaido (Japan)</SelectItem>
                <SelectItem value="Tohoku">Tohoku (Japan)</SelectItem>
                <SelectItem value="England">England (UK)</SelectItem>
                <SelectItem value="Scotland">Scotland (UK)</SelectItem>
                <SelectItem value="Wales">Wales (UK)</SelectItem>
                <SelectItem value="California">California (USA)</SelectItem>
                <SelectItem value="Texas">Texas (USA)</SelectItem>
                <SelectItem value="New York">New York (USA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Querying...
              </>
            ) : (
              <>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset} size="lg">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
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
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {stats.totalMatched.toLocaleString()}
                </span>
                <span className="text-sm">records found</span>
              </div>
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-300"
              >
                {stats.queryTime}ms
              </Badge>
            </div>
            {records.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>

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
          {records.length === 0 && stats.totalMatched === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No records match your filter criteria</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!stats && !error && (
        <div className="text-center py-8 text-slate-500">
          <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Select filters and click "Apply Filters" to search</p>
          <p className="text-sm mt-1">Query 300,000 patient records</p>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
