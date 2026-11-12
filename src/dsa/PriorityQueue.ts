import { Patient } from "../types/patient";
import { Queue } from "./Queue";

/**
 * DATA STRUCTURE 4: Priority Queue using Multi-Level FIFO Queues (or Max-Heap)
 * Requirement:
 * "Patients with a higher emergency level must be treated before patients with a lower emergency level.
 * If two patients have the same emergency level, the patient who arrived earlier should be treated first.
 * Required Data Structures:
 * - Priority Queue – for emergency patients.
 * - Queue – for maintaining patients with the same priority/arrival sequence."
 * 
 * We implement this elegant hybrid Priority Queue using 5 distinct FIFO Queues (one per emergency level: 5 down to 1).
 * When `dequeue()` is called, it checks from highest emergency level (5) down to lowest (1).
 * Within the same level, patients are stored in a standard Queue, strictly guaranteeing FIFO arrival order!
 */

export class PriorityQueue {
  // Mapping priority level (1 to 5) to FIFO Queue
  private levels: Map<number, Queue<Patient>> = new Map();
  private totalCount: number = 0;

  constructor() {
    for (let i = 1; i <= 5; i++) {
      this.levels.set(i, new Queue<Patient>());
    }
  }

  // Insert patient into corresponding emergency queue
  insert(patient: Patient): void {
    const queue = this.levels.get(patient.emergencyLevel);
    if (queue) {
      queue.enqueue(patient);
      this.totalCount++;
    }
  }

  // Treat next patient: highest level first, FIFO within same level
  extractNext(): Patient | null {
    for (let level = 5; level >= 1; level--) {
      const queue = this.levels.get(level);
      if (queue && !queue.isEmpty()) {
        const nextPatient = queue.dequeue();
        if (nextPatient) {
          this.totalCount--;
          return nextPatient;
        }
      }
    }
    return null;
  }

  // Peek the highest priority patient without removing
  peek(): Patient | null {
    for (let level = 5; level >= 1; level--) {
      const queue = this.levels.get(level);
      if (queue && !queue.isEmpty()) {
        return queue.peek();
      }
    }
    return null;
  }

  // Remove specific patient by ID (e.g. cancellation)
  removeById(patientId: string): Patient | null {
    for (let level = 5; level >= 1; level--) {
      const queue = this.levels.get(level);
      if (queue) {
        const removed = queue.remove(p => p.id === patientId);
        if (removed) {
          this.totalCount--;
          return removed;
        }
      }
    }
    return null;
  }

  // Get all waiting patients in priority order
  getAllWaiting(): Patient[] {
    const result: Patient[] = [];
    for (let level = 5; level >= 1; level--) {
      const queue = this.levels.get(level);
      if (queue) {
        result.push(...queue.toArray());
      }
    }
    return result;
  }

  // Get queue breakdown per level
  getLevelBreakdown(): { level: number; patients: Patient[] }[] {
    const breakdown: { level: number; patients: Patient[] }[] = [];
    for (let level = 5; level >= 1; level--) {
      const queue = this.levels.get(level);
      breakdown.push({
        level,
        patients: queue ? queue.toArray() : [],
      });
    }
    return breakdown;
  }

  size(): number {
    return this.totalCount;
  }

  isEmpty(): boolean {
    return this.totalCount === 0;
  }
}
