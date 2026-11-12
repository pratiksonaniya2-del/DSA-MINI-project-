/**
 * Emergency Patient Model
 * Emergency Levels:
 * 5 - Resuscitation / Critical (Immediate Life Threat)
 * 4 - Emergent (High Risk / Severe Pain / Unstable)
 * 3 - Urgent (Moderate Distress / Needs Prompt Treatment)
 * 2 - Less Urgent (Stable / Non-life threatening)
 * 1 - Non-Urgent (Routine minor issues)
 */
export interface Patient {
  id: string;              // e.g., "P-101"
  name: string;            // Patient full name
  age: number;             // Age
  gender: string;          // Gender
  emergencyLevel: number;  // 1 to 5 (higher is more critical)
  conditionDescription: string;
  arrivalNumber: number;   // Global sequential arrival counter
  arrivalTime: Date;       // Timestamp of arrival
  status: 'WAITING' | 'TREATED' | 'CANCELLED';
  treatedTime?: Date;
  doctorNotes?: string;
}

export type TriageCategory = {
  level: number;
  label: string;
  color: string;
  badgeClass: string;
  description: string;
};

export const TRIAGE_LEVELS: Record<number, TriageCategory> = {
  5: {
    level: 5,
    label: "Level 5 - Resuscitation",
    color: "#dc2626",
    badgeClass: "bg-red-500/10 text-red-700 border-red-300 dark:text-red-400 dark:border-red-900/50",
    description: "Immediate life-saving intervention needed"
  },
  4: {
    level: 4,
    label: "Level 4 - Emergent",
    color: "#ea580c",
    badgeClass: "bg-orange-500/10 text-orange-700 border-orange-300 dark:text-orange-400 dark:border-orange-900/50",
    description: "High risk, potential rapid deterioration"
  },
  3: {
    level: 3,
    label: "Level 3 - Urgent",
    color: "#ca8a04",
    badgeClass: "bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-900/50",
    description: "Moderate distress, timely medical care needed"
  },
  2: {
    level: 2,
    label: "Level 2 - Less Urgent",
    color: "#2563eb",
    badgeClass: "bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-900/50",
    description: "Condition stable, can safely wait"
  },
  1: {
    level: 1,
    label: "Level 1 - Non-Urgent",
    color: "#16a34a",
    badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-900/50",
    description: "Minor symptoms, routine care"
  }
};
