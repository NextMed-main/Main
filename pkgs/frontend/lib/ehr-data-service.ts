/**
 * EHR Data Service
 *
 * This service reads and processes the NextMed EHR demo CSV file,
 * providing pre-computed statistics and intelligent data sampling
 * for the AI to analyze.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

// Types for EHR data
export interface EHRRecord {
  fullName: string;
  age: number;
  gender: string;
  region: string;
  address: string;
  symptoms: string[];
  medicationHistory: string[];
  pastVisits: PastVisit[];
  phoneNumber: string;
  insuranceId: string;
}

export interface PastVisit {
  date: string;
  diagnosis: string;
}

export interface EHRStatistics {
  totalRecords: number;
  lastUpdated: string;
  demographics: {
    ageDistribution: Record<string, number>;
    genderDistribution: Record<string, number>;
    regionDistribution: Record<string, number>;
  };
  conditions: {
    chronicConditions: Record<string, number>;
    topDiagnoses: Record<string, number>;
  };
  medications: {
    topMedications: Record<string, number>;
    patientsOnMedication: number;
    patientsNoMedication: number;
  };
  visitStats: {
    totalVisits: number;
    avgVisitsPerPatient: number;
    visitsByYear: Record<string, number>;
  };
}

// Cache for parsed data
let cachedRecords: EHRRecord[] | null = null;
let cachedStats: EHRStatistics | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Parse a CSV row handling quoted values with commas
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * Parse past visits string like "[2024-10-06: Fever], [2024-08-16: Allergic Rhinitis]"
 */
function parsePastVisits(visitStr: string): PastVisit[] {
  if (!visitStr || visitStr === "None") return [];

  const visits: PastVisit[] = [];
  const matches = visitStr.match(/\[([^\]]+)\]/g);

  if (matches) {
    for (const match of matches) {
      const content = match.slice(1, -1); // Remove brackets
      const colonIndex = content.indexOf(":");
      if (colonIndex > -1) {
        visits.push({
          date: content.slice(0, colonIndex).trim(),
          diagnosis: content.slice(colonIndex + 1).trim(),
        });
      }
    }
  }

  return visits;
}

/**
 * Parse symptoms/conditions string
 */
function parseListField(value: string): string[] {
  if (!value || value === "None") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Get age group for distribution
 */
function getAgeGroup(age: number): string {
  if (age < 18) return "0-17";
  if (age < 30) return "18-29";
  if (age < 45) return "30-44";
  if (age < 60) return "45-59";
  if (age < 75) return "60-74";
  return "75+";
}

/**
 * Load and parse the EHR CSV file
 */
export async function loadEHRData(): Promise<EHRRecord[]> {
  // Check cache
  if (
    cachedRecords &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_TTL_MS
  ) {
    return cachedRecords;
  }

  const csvPath = path.join(
    process.cwd(),
    "public",
    "demo-data",
    "nextmed_ehr_demo_300k.csv",
  );

  try {
    const content = await fs.readFile(csvPath, "utf-8");
    const lines = content.split("\n").filter((line) => line.trim());

    // Skip header
    const dataLines = lines.slice(1);
    const records: EHRRecord[] = [];

    for (const line of dataLines) {
      const fields = parseCSVRow(line);
      if (fields.length < 10) continue;

      const record: EHRRecord = {
        fullName: fields[0] || "",
        age: Number.parseInt(fields[1], 10) || 0,
        gender: fields[2] || "",
        region: fields[3] || "",
        address: fields[4] || "",
        symptoms: parseListField(fields[5]),
        medicationHistory: parseListField(fields[6]),
        pastVisits: parsePastVisits(fields[7]),
        phoneNumber: fields[8] || "",
        insuranceId: fields[9] || "",
      };

      records.push(record);
    }

    cachedRecords = records;
    cacheTimestamp = Date.now();
    cachedStats = null; // Invalidate stats cache

    return records;
  } catch (error) {
    console.error("Failed to load EHR data:", error);
    return [];
  }
}

/**
 * Compute statistics from the EHR data
 */
export async function getEHRStatistics(): Promise<EHRStatistics> {
  // Check cache
  if (
    cachedStats &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_TTL_MS
  ) {
    return cachedStats;
  }

  const records = await loadEHRData();

  const stats: EHRStatistics = {
    totalRecords: records.length,
    lastUpdated: new Date().toISOString(),
    demographics: {
      ageDistribution: {},
      genderDistribution: {},
      regionDistribution: {},
    },
    conditions: {
      chronicConditions: {},
      topDiagnoses: {},
    },
    medications: {
      topMedications: {},
      patientsOnMedication: 0,
      patientsNoMedication: 0,
    },
    visitStats: {
      totalVisits: 0,
      avgVisitsPerPatient: 0,
      visitsByYear: {},
    },
  };

  for (const record of records) {
    // Age distribution
    const ageGroup = getAgeGroup(record.age);
    stats.demographics.ageDistribution[ageGroup] =
      (stats.demographics.ageDistribution[ageGroup] || 0) + 1;

    // Gender distribution
    stats.demographics.genderDistribution[record.gender] =
      (stats.demographics.genderDistribution[record.gender] || 0) + 1;

    // Region distribution
    stats.demographics.regionDistribution[record.region] =
      (stats.demographics.regionDistribution[record.region] || 0) + 1;

    // Chronic conditions (from symptoms field which contains chronic conditions)
    for (const condition of record.symptoms) {
      stats.conditions.chronicConditions[condition] =
        (stats.conditions.chronicConditions[condition] || 0) + 1;
    }

    // Medications
    if (record.medicationHistory.length > 0) {
      stats.medications.patientsOnMedication++;
      for (const med of record.medicationHistory) {
        stats.medications.topMedications[med] =
          (stats.medications.topMedications[med] || 0) + 1;
      }
    } else {
      stats.medications.patientsNoMedication++;
    }

    // Past visits
    stats.visitStats.totalVisits += record.pastVisits.length;
    for (const visit of record.pastVisits) {
      // Count diagnoses
      stats.conditions.topDiagnoses[visit.diagnosis] =
        (stats.conditions.topDiagnoses[visit.diagnosis] || 0) + 1;

      // Count by year
      const year = visit.date.split("-")[0];
      if (year) {
        stats.visitStats.visitsByYear[year] =
          (stats.visitStats.visitsByYear[year] || 0) + 1;
      }
    }
  }

  stats.visitStats.avgVisitsPerPatient =
    records.length > 0
      ? Math.round((stats.visitStats.totalVisits / records.length) * 100) / 100
      : 0;

  // Sort and limit top items
  const sortAndLimit = (
    obj: Record<string, number>,
    limit = 20,
  ): Record<string, number> => {
    return Object.fromEntries(
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit),
    );
  };

  stats.demographics.regionDistribution = sortAndLimit(
    stats.demographics.regionDistribution,
    30,
  );
  stats.conditions.chronicConditions = sortAndLimit(
    stats.conditions.chronicConditions,
  );
  stats.conditions.topDiagnoses = sortAndLimit(stats.conditions.topDiagnoses);
  stats.medications.topMedications = sortAndLimit(
    stats.medications.topMedications,
  );

  cachedStats = stats;
  return stats;
}

/**
 * Search/filter records based on criteria
 */
export async function searchRecords(options: {
  condition?: string;
  medication?: string;
  region?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  diagnosis?: string;
  limit?: number;
}): Promise<EHRRecord[]> {
  const records = await loadEHRData();
  const limit = options.limit || 50;

  let filtered = records;

  if (options.condition) {
    const conditionLower = options.condition.toLowerCase();
    filtered = filtered.filter((r) =>
      r.symptoms.some((s) => s.toLowerCase().includes(conditionLower)),
    );
  }

  if (options.medication) {
    const medLower = options.medication.toLowerCase();
    filtered = filtered.filter((r) =>
      r.medicationHistory.some((m) => m.toLowerCase().includes(medLower)),
    );
  }

  if (options.region) {
    const regionLower = options.region.toLowerCase();
    filtered = filtered.filter((r) =>
      r.region.toLowerCase().includes(regionLower),
    );
  }

  if (options.ageMin !== undefined) {
    const minAge = options.ageMin;
    filtered = filtered.filter((r) => r.age >= minAge);
  }

  if (options.ageMax !== undefined) {
    const maxAge = options.ageMax;
    filtered = filtered.filter((r) => r.age <= maxAge);
  }

  if (options.gender) {
    const genderLower = options.gender.toLowerCase();
    filtered = filtered.filter((r) => r.gender.toLowerCase() === genderLower);
  }

  if (options.diagnosis) {
    const diagLower = options.diagnosis.toLowerCase();
    filtered = filtered.filter((r) =>
      r.pastVisits.some((v) => v.diagnosis.toLowerCase().includes(diagLower)),
    );
  }

  return filtered.slice(0, limit);
}

/**
 * Get a random sample of records for context
 */
export async function getSampleRecords(count = 10): Promise<EHRRecord[]> {
  const records = await loadEHRData();
  const sample: EHRRecord[] = [];
  const indices = new Set<number>();

  while (sample.length < count && indices.size < records.length) {
    const idx = Math.floor(Math.random() * records.length);
    if (!indices.has(idx)) {
      indices.add(idx);
      sample.push(records[idx]);
    }
  }

  return sample;
}

/**
 * Generate a context summary for AI analysis
 */
export async function generateAIContext(): Promise<string> {
  const stats = await getEHRStatistics();
  const sampleRecords = await getSampleRecords(5);

  const context = `
## NextMed EHR Database Overview

### Dataset Statistics
- **Total Patient Records**: ${stats.totalRecords.toLocaleString()}
- **Total Medical Visits**: ${stats.visitStats.totalVisits.toLocaleString()}
- **Average Visits per Patient**: ${stats.visitStats.avgVisitsPerPatient}
- **Patients on Medication**: ${stats.medications.patientsOnMedication.toLocaleString()} (${Math.round((stats.medications.patientsOnMedication / stats.totalRecords) * 100)}%)

### Demographics

**Age Distribution:**
${Object.entries(stats.demographics.ageDistribution)
  .sort((a, b) => {
    const order = ["0-17", "18-29", "30-44", "45-59", "60-74", "75+"];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  })
  .map(
    ([group, count]) =>
      `- ${group} years: ${count.toLocaleString()} patients (${Math.round((count / stats.totalRecords) * 100)}%)`,
  )
  .join("\n")}

**Gender Distribution:**
${Object.entries(stats.demographics.genderDistribution)
  .map(
    ([gender, count]) =>
      `- ${gender}: ${count.toLocaleString()} patients (${Math.round((count / stats.totalRecords) * 100)}%)`,
  )
  .join("\n")}

**Top Regions:**
${Object.entries(stats.demographics.regionDistribution)
  .slice(0, 10)
  .map(([region, count]) => `- ${region}: ${count.toLocaleString()} patients`)
  .join("\n")}

### Chronic Conditions (Top 15)
${Object.entries(stats.conditions.chronicConditions)
  .slice(0, 15)
  .map(
    ([condition, count]) =>
      `- ${condition}: ${count.toLocaleString()} patients (${Math.round((count / stats.totalRecords) * 100)}%)`,
  )
  .join("\n")}

### Top Diagnoses from Visits
${Object.entries(stats.conditions.topDiagnoses)
  .slice(0, 15)
  .map(
    ([diagnosis, count]) =>
      `- ${diagnosis}: ${count.toLocaleString()} occurrences`,
  )
  .join("\n")}

### Medications Prescribed (Top 10)
${Object.entries(stats.medications.topMedications)
  .slice(0, 10)
  .map(([med, count]) => `- ${med}: ${count.toLocaleString()} patients`)
  .join("\n")}

### Visits by Year
${Object.entries(stats.visitStats.visitsByYear)
  .sort((a, b) => b[0].localeCompare(a[0]))
  .map(([year, count]) => `- ${year}: ${count.toLocaleString()} visits`)
  .join("\n")}

### Sample Patient Records (for reference)
${sampleRecords
  .map(
    (r, i) => `
**Patient ${i + 1}:** ${r.fullName}
- Age: ${r.age}, Gender: ${r.gender}
- Region: ${r.region}
- Chronic Conditions: ${r.symptoms.length > 0 ? r.symptoms.join(", ") : "None"}
- Current Medications: ${r.medicationHistory.length > 0 ? r.medicationHistory.join(", ") : "None"}
- Recent Visits: ${
      r.pastVisits.length > 0
        ? r.pastVisits
            .slice(0, 3)
            .map((v) => `${v.date}: ${v.diagnosis}`)
            .join("; ")
        : "None"
    }`,
  )
  .join("\n")}

### Data Fields Available
- Full Name, Age, Gender
- Region and Address
- Chronic Conditions/Symptoms
- Medication History
- Past Medical Visits (Date + Diagnosis)
- Phone Number, Insurance ID

This data represents patient records from multiple regions including Japan (Kanto, Kansai, Hokkaido, Tohoku, Chubu, Kyushu), UK (England, Scotland, Wales), and USA (various states).
`;

  return context;
}
