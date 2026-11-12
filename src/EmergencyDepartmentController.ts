import { Patient } from "./types/patient";
import { PriorityQueue } from "./dsa/PriorityQueue";
import { BinarySearchTree } from "./dsa/BinarySearchTree";
import { LinkedList } from "./dsa/LinkedList";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'REGISTER' | 'TREAT' | 'SEARCH' | 'CANCEL' | 'INFO';
  message: string;
  dsaUsed: string;
}

export class EmergencyDepartmentController {
  private priorityQueue: PriorityQueue;
  private bst: BinarySearchTree;
  private treatedHistory: LinkedList<Patient>;
  private arrivalCounter: number = 0;
  private logs: LogEntry[] = [];

  constructor() {
    this.priorityQueue = new PriorityQueue();
    this.bst = new BinarySearchTree();
    this.treatedHistory = new LinkedList<Patient>();
  }

  
  registerPatient(data: {
    id: string;
    name: string;
    age: number;
    gender: string;
    emergencyLevel: number;
    conditionDescription: string;
  }): { success: boolean; message: string; patient?: Patient } {
    
    const existing = this.bst.search(data.id);
    if (existing && existing.status === 'WAITING') {
      return {
        success: false,
        message: `Patient ID "${data.id}" is already actively waiting in triage!`,
      };
    }

    this.arrivalCounter++;
    const newPatient: Patient = {
      ...data,
      arrivalNumber: this.arrivalCounter,
      arrivalTime: new Date(),
      status: 'WAITING',
    };

    
    this.priorityQueue.insert(newPatient);

    
    this.bst.insert(newPatient);

    this.addLog(
      'REGISTER',
      `Registered patient ${newPatient.name} (ID: ${newPatient.id}) - Level ${newPatient.emergencyLevel} (Arrival #${newPatient.arrivalNumber})`,
      'PriorityQueue.insert() & BST.insert()'
    );

    return {
      success: true,
      message: `Patient ${newPatient.name} registered successfully with arrival #${newPatient.arrivalNumber}.`,
      patient: newPatient,
    };
  }

  
  treatNextPatient(doctorNotes?: string): { success: boolean; patient?: Patient; message: string } {
    if (this.priorityQueue.isEmpty()) {
      return {
        success: false,
        message: "No patients currently waiting in the emergency queue.",
      };
    }

    const nextPatient = this.priorityQueue.extractNext();
    if (!nextPatient) {
      return {
        success: false,
        message: "Failed to retrieve next patient.",
      };
    }

    nextPatient.status = 'TREATED';
    nextPatient.treatedTime = new Date();
    nextPatient.doctorNotes = doctorNotes || "Treated and stabilized in ER.";

    
    this.bst.insert(nextPatient); 

    
    this.treatedHistory.prepend(nextPatient);

    this.addLog(
      'TREAT',
      `Treated patient ${nextPatient.name} (ID: ${nextPatient.id}) - Emergency Level ${nextPatient.emergencyLevel}`,
      'PriorityQueue.extractNext() & LinkedList.prepend()'
    );

    return {
      success: true,
      patient: nextPatient,
      message: `Patient ${nextPatient.name} treated successfully.`,
    };
  }

  
  searchPatient(id: string): { found: boolean; patient?: Patient; traversalType: string } {
    const patient = this.bst.search(id);
    this.addLog(
      'SEARCH',
      patient ? `Found patient ${patient.name} for ID "${id}"` : `No patient record found for ID "${id}"`,
      'BinarySearchTree.search(id)'
    );

    return {
      found: !!patient,
      patient: patient || undefined,
      traversalType: 'Binary Search Tree (O(log n) average)',
    };
  }

  
  cancelRegistration(id: string): { success: boolean; message: string } {
    const patient = this.bst.search(id);
    if (!patient) {
      return {
        success: false,
        message: `Patient with ID "${id}" not found.`,
      };
    }

    if (patient.status !== 'WAITING') {
      return {
        success: false,
        message: `Patient with ID "${id}" is already ${patient.status.toLowerCase()} and cannot be cancelled.`,
      };
    }

    
    const removed = this.priorityQueue.removeById(id);

    if (removed) {
      removed.status = 'CANCELLED';
      this.bst.delete(id); 

      this.addLog(
        'CANCEL',
        `Cancelled registration for patient ${removed.name} (ID: ${id})`,
        'PriorityQueue.removeById() & BST.delete()'
      );

      return {
        success: true,
        message: `Registration for patient ${removed.name} (ID: ${id}) has been cancelled.`,
      };
    }

    return {
      success: false,
      message: `Could not locate patient in waiting queues.`,
    };
  }

  
  getAllWaitingPatients(): Patient[] {
    return this.priorityQueue.getAllWaiting();
  }

  
  getTreatedHistory(): Patient[] {
    return this.treatedHistory.toArray();
  }

  
  getQueueBreakdown() {
    return this.priorityQueue.getLevelBreakdown();
  }

  getBSTStructure() {
    return this.bst.getTreeStructure();
  }

  getBSTInOrder(): Patient[] {
    return this.bst.inOrderTraversal();
  }

  getWaitingCount(): number {
    return this.priorityQueue.size();
  }

  getTreatedCount(): number {
    return this.treatedHistory.size();
  }

  getNextPatientInLine(): Patient | null {
    return this.priorityQueue.peek();
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  private addLog(type: LogEntry['type'], message: string, dsaUsed: string) {
    this.logs.unshift({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      dsaUsed,
    });
    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }

  
  seedSampleData(): void {
    const samples = [
      { id: "P-101", name: "David Miller", age: 58, gender: "Male", emergencyLevel: 5, conditionDescription: "Acute cardiac arrest, non-responsive" },
      { id: "P-102", name: "Sarah Connor", age: 34, gender: "Female", emergencyLevel: 3, conditionDescription: "Suspected radius fracture, severe localized pain" },
      { id: "P-103", name: "Michael Chang", age: 42, gender: "Male", emergencyLevel: 4, conditionDescription: "Third-degree thermal burn on forearm" },
      { id: "P-104", name: "Emily Watson", age: 26, gender: "Female", emergencyLevel: 5, conditionDescription: "Anaphylactic shock following medication" },
      { id: "P-105", name: "Robert Taylor", age: 67, gender: "Male", emergencyLevel: 2, conditionDescription: "Persistent mild abdominal cramps for 2 days" },
      { id: "P-106", name: "Jessica Alba", age: 19, gender: "Female", emergencyLevel: 1, conditionDescription: "Sore throat and mild low-grade fever" },
      { id: "P-107", name: "James Wilson", age: 50, gender: "Male", emergencyLevel: 4, conditionDescription: "Uncontrolled epistaxis, hypertensive emergency" },
    ];

    for (const s of samples) {
      this.registerPatient(s);
    }

    
    this.treatNextPatient("Defibrillated and stabilized. Transferred to ICU.");
    this.treatNextPatient("Epinephrine administered. Airway cleared and stable.");
  }
}
