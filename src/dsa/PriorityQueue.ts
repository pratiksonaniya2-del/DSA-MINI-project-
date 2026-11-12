import { Patient } from "../types/patient";
import { Queue } from "./Queue";

export class PriorityQueue {
  
  private levels: Map<number, Queue<Patient>> = new Map();
  private totalCount: number = 0;

  constructor() {
    for (let i = 1; i <= 5; i++) {
      this.levels.set(i, new Queue<Patient>());
    }
  }

  
  insert(patient: Patient): void {
    const queue = this.levels.get(patient.emergencyLevel);
    if (queue) {
      queue.enqueue(patient);
      this.totalCount++;
    }
  }

  
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

  
  peek(): Patient | null {
    for (let level = 5; level >= 1; level--) {
      const queue = this.levels.get(level);
      if (queue && !queue.isEmpty()) {
        return queue.peek();
      }
    }
    return null;
  }

  
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
