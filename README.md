# Emergency Patient Management System (Project 4)

Hospital Emergency Department Patient Management System developed with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🎯 Project Overview & Problem Statement
Patients arriving at an Emergency Department (ED) must be triaged based on their urgency level and arrival order. 
- Higher emergency levels (Level 5 Resuscitation down to Level 1 Non-Urgent) are prioritized first.
- If two patients share the same emergency level, they are treated in strict First-In-First-Out (**FIFO**) arrival sequence.
- Fast lookups and cancellations by `patient ID` must be supported.
- Complete clinical treatment history must be retained.

---

## 🏗️ Core Data Structures Implemented

| Requirement | Data Structure | Purpose | File Location |
| :--- | :--- | :--- | :--- |
| **Emergency Prioritization** | **Priority Queue** | Categorizes and schedules patients across 5 emergency levels. Guarantees higher urgency is extracted first. | `src/dsa/PriorityQueue.ts` |
| **Same-Priority Sequence** | **FIFO Queue** | Implements standard linked queue within each priority bucket to guarantee arrival order. | `src/dsa/Queue.ts` |
| **Search by Patient ID** | **Binary Search Tree (BST)** | Indexes all registered patients by their unique ID for $O(\log n)$ lookup and deletion. | `src/dsa/BinarySearchTree.ts` |
| **Treatment History** | **Singly Linked List** | Stores records of all completed treatments in chronological order using $O(1)$ head prepending. | `src/dsa/LinkedList.ts` |

---

## 🚀 Implemented Operations
1. **Register New Patient**: Captures ID, Name, Age, Gender, Emergency Level (1–5), and Clinical Condition. Inserts into Priority Queue and BST.
2. **Treat Next Patient**: Pops highest priority patient (FIFO within same level) from Priority Queue, updates medical notes, and prepends to the Linked List history.
3. **Search Patient by ID**: Uses the Binary Search Tree to find patient status (Waiting/Treated), triage level, arrival number, and doctor notes.
4. **Display All Waiting Patients**: Shows tabular emergency queue ordered by level and arrival index.
5. **Cancel Registration**: Deletes patient from active waiting queue and updates BST index.
6. **Display Treated History**: Displays chronological medical records directly from the Linked List nodes.
7. **DSA Visualizer & Logs**: Real-time inspection of internal level queues, BST in-order traversal, and timestamped algorithm execution logs.

---

## 💻 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
