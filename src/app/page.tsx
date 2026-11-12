"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  UserPlus, 
  Stethoscope, 
  Search, 
  Trash2, 
  History, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Network, 
  CheckCircle2, 
  RefreshCw,
  FileText,
  HeartPulse,
  Info
} from "lucide-react";
import { EmergencyDepartmentController, LogEntry } from "../EmergencyDepartmentController";
import { Patient, TRIAGE_LEVELS } from "../types/patient";

let erSystem: EmergencyDepartmentController;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  
  const [activeTab, setActiveTab] = useState<"triage" | "search" | "history" | "dsa">("triage");
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [historyPatients, setHistoryPatients] = useState<Patient[]>([]);
  const [queueBreakdown, setQueueBreakdown] = useState<{ level: number; patients: Patient[] }[]>([]);
  const [nextPatient, setNextPatient] = useState<Patient | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  
  const [formData, setFormData] = useState({
    id: "P-" + Math.floor(100 + Math.random() * 900),
    name: "",
    age: "",
    gender: "Male",
    emergencyLevel: 3,
    conditionDescription: ""
  });
  const [formMsg, setFormMsg] = useState<{ text: string; error?: boolean } | null>(null);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{ patient?: Patient; found: boolean } | null>(null);

  
  const [doctorNotes, setDoctorNotes] = useState("");
  const [treatmentMsg, setTreatmentMsg] = useState<string | null>(null);

  const refreshState = () => {
    if (!erSystem) return;
    setWaitingPatients([...erSystem.getAllWaitingPatients()]);
    setHistoryPatients([...erSystem.getTreatedHistory()]);
    setQueueBreakdown([...erSystem.getQueueBreakdown()]);
    setNextPatient(erSystem.getNextPatientInLine());
    setLogs([...erSystem.getLogs()]);
  };

  useEffect(() => {
    erSystem = new EmergencyDepartmentController();
    erSystem.seedSampleData();
    refreshState();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center space-x-3 text-lg font-medium">
          <Activity className="h-6 w-6 animate-pulse text-red-500" />
          <span>Booting Emergency Department Triage System...</span>
        </div>
      </div>
    );
  }

  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age || !formData.conditionDescription.trim()) {
      setFormMsg({ text: "Please fill out all mandatory clinical fields.", error: true });
      return;
    }

    const res = erSystem.registerPatient({
      id: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      age: parseInt(formData.age),
      gender: formData.gender,
      emergencyLevel: Number(formData.emergencyLevel),
      conditionDescription: formData.conditionDescription.trim(),
    });

    if (res.success) {
      setFormMsg({ text: res.message, error: false });
      setFormData({
        id: "P-" + Math.floor(100 + Math.random() * 900),
        name: "",
        age: "",
        gender: "Male",
        emergencyLevel: 3,
        conditionDescription: ""
      });
      refreshState();
    } else {
      setFormMsg({ text: res.message, error: true });
    }
  };

  
  const handleTreatNext = () => {
    const res = erSystem.treatNextPatient(doctorNotes || undefined);
    if (res.success) {
      setTreatmentMsg(`✓ Successfully treated ${res.patient?.name} (Emergency Level ${res.patient?.emergencyLevel}).`);
      setDoctorNotes("");
      refreshState();
    } else {
      setTreatmentMsg(`⚠️ ${res.message}`);
    }
    setTimeout(() => setTreatmentMsg(null), 4000);
  };

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = erSystem.searchPatient(searchQuery.trim().toUpperCase());
    setSearchResult(res);
    refreshState();
  };

  
  const handleCancelRegistration = (id: string) => {
    if (!confirm(`Are you sure you want to cancel registration for patient ID ${id}?`)) return;
    const res = erSystem.cancelRegistration(id);
    alert(res.message);
    refreshState();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600 rounded-lg shadow-sm">
              <HeartPulse className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  St. Jude Trauma & Emergency Department
                </h1>
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  PROJECT 4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hospital ED Triage System &bull; Custom Priority Queue, BST, Queue, & Linked List Implementation
              </p>
            </div>
          </div>

          {}
          <div className="flex items-center space-x-4 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Waiting in ED: </span>
              <span className="font-bold text-amber-400 text-sm ml-1">{waitingPatients.length}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Treated Today: </span>
              <span className="font-bold text-emerald-400 text-sm ml-1">{historyPatients.length}</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Arrival Counter: </span>
              <span className="font-bold text-blue-400 text-sm ml-1">#{erSystem.getWaitingCount() + erSystem.getTreatedCount()}</span>
            </div>
          </div>
        </div>

        {}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-800/80 pt-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab("triage")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === "triage"
                ? "border-red-500 text-red-400 bg-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Emergency Triage & Queue</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === "search"
                ? "border-blue-500 text-blue-400 bg-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Search className="h-4 w-4" />
            <span>BST Patient Search</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === "history"
                ? "border-emerald-500 text-emerald-400 bg-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Treated History (Linked List)</span>
          </button>

          <button
            onClick={() => setActiveTab("dsa")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === "dsa"
                ? "border-purple-500 text-purple-400 bg-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>DSA Data Structure Visualizer</span>
          </button>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {}
        {activeTab === "triage" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {}
            <div className="lg:col-span-4 space-y-6">
              {}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-red-100 flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4" /> Emergency Doctor Desk
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                      Priority Queue
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-1">Next Patient for Treatment</h3>
                </div>

                <div className="p-4 space-y-3">
                  {treatmentMsg && (
                    <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
                      {treatmentMsg}
                    </div>
                  )}

                  {nextPatient ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-base">{nextPatient.name}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {nextPatient.id} &bull; Age: {nextPatient.age} &bull; {nextPatient.gender}</div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded border ${TRIAGE_LEVELS[nextPatient.emergencyLevel].badgeClass}`}>
                          Level {nextPatient.emergencyLevel}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
                        <span className="font-semibold text-slate-900">Condition: </span>
                        {nextPatient.conditionDescription}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span>Arrival #{nextPatient.arrivalNumber}</span>
                        <span>{new Date(nextPatient.arrivalTime).toLocaleTimeString()}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <input
                          type="text"
                          placeholder="Doctor clinical notes (optional)..."
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          className="w-full text-xs px-3 py-2 border rounded-md focus:ring-1 focus:ring-red-500 focus:outline-none"
                        />
                        <button
                          onClick={handleTreatNext}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition text-sm flex items-center justify-center space-x-2"
                        >
                          <Stethoscope className="h-4 w-4" />
                          <span>Treat Patient Now</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 space-y-1">
                      <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
                      <p className="text-sm font-medium text-slate-600">No patients waiting in queue</p>
                      <p className="text-xs text-slate-400">All triage queues are currently cleared.</p>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">Register New Patient</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, id: "P-" + Math.floor(100 + Math.random() * 900) })}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
                    title="Generate new ID"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Auto ID</span>
                  </button>
                </div>

                {formMsg && (
                  <div className={`p-2.5 rounded-lg text-xs font-medium border ${
                    formMsg.error ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {formMsg.text}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Patient ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded border-slate-300 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Age *</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        placeholder="e.g. 45"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded border-slate-300 text-xs bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Emergency Level (1 - 5) *</label>
                    <select
                      value={formData.emergencyLevel}
                      onChange={(e) => setFormData({ ...formData, emergencyLevel: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded border-slate-300 text-xs bg-white font-medium focus:ring-1 focus:ring-blue-500"
                    >
                      <option value={5}>Level 5 - Resuscitation (Immediate Life Threat)</option>
                      <option value={4}>Level 4 - Emergent (High Risk / Severe Pain)</option>
                      <option value={3}>Level 3 - Urgent (Moderate Distress)</option>
                      <option value={2}>Level 2 - Less Urgent (Stable Condition)</option>
                      <option value={1}>Level 1 - Non-Urgent (Minor Complaint)</option>
                    </select>
                    <p className="mt-1 text-[11px] text-slate-500 italic">
                      {TRIAGE_LEVELS[formData.emergencyLevel].description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Clinical Symptoms / Reason *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Chest pain radiating to left arm, shortness of breath"
                      value={formData.conditionDescription}
                      onChange={(e) => setFormData({ ...formData, conditionDescription: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition text-xs flex items-center justify-center space-x-1.5"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register Patient into Queue</span>
                  </button>
                </form>
              </div>
            </div>

            {}
            <div className="lg:col-span-8 space-y-6">
              {}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <span>Waiting Patients Queue</span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-slate-300">
                        {waitingPatients.length} Active
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sorted strictly by Emergency Level (5 to 1) &bull; Same emergency level sorted by Arrival Order (FIFO Queue)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      onClick={refreshState}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {waitingPatients.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Activity className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No waiting patients</p>
                    <p className="text-xs text-slate-400">Register new incoming patients using the form on the left.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Order</th>
                          <th className="py-2.5 px-3">Patient ID</th>
                          <th className="py-2.5 px-3">Name & Demographics</th>
                          <th className="py-2.5 px-3">Emergency Level</th>
                          <th className="py-2.5 px-3">Chief Complaint</th>
                          <th className="py-2.5 px-3">Arrival #</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {waitingPatients.map((patient, index) => {
                          const triage = TRIAGE_LEVELS[patient.emergencyLevel];
                          return (
                            <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-400">
                                {index + 1}
                              </td>
                              <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                                {patient.id}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{patient.name}</div>
                                <div className="text-[11px] text-slate-500">{patient.age}y &bull; {patient.gender}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${triage.badgeClass}`}>
                                  Level {patient.emergencyLevel}
                                </span>
                              </td>
                              <td className="py-3 px-3 max-w-[200px] truncate text-slate-700" title={patient.conditionDescription}>
                                {patient.conditionDescription}
                              </td>
                              <td className="py-3 px-3 text-slate-500">
                                <span className="font-mono font-medium">#{patient.arrivalNumber}</span>
                                <div className="text-[10px] text-slate-400">{new Date(patient.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleCancelRegistration(patient.id)}
                                  title="Cancel Registration"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <Layers className="h-4 w-4 text-purple-600" />
                    <span>Priority Queue Structure Breakdown</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">5 Independent FIFO Queues</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {queueBreakdown.map((item) => {
                    const triage = TRIAGE_LEVELS[item.level];
                    return (
                      <div key={item.level} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${triage.badgeClass}`}>
                            Level {item.level}
                          </span>
                          <span className="font-bold text-xs font-mono text-slate-600">
                            {item.patients.length} waiting
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate" title={triage.label}>
                          {triage.label.split("-")[1]?.trim()}
                        </div>
                        <div className="h-16 overflow-y-auto space-y-1 bg-white p-1.5 rounded border border-slate-200 text-[10px]">
                          {item.patients.length === 0 ? (
                            <span className="text-slate-300 italic block py-3 text-center">Empty queue</span>
                          ) : (
                            item.patients.map((p) => (
                              <div key={p.id} className="truncate font-mono bg-slate-100 px-1 py-0.5 rounded flex justify-between">
                                <span>{p.id}</span>
                                <span className="text-slate-400">#{p.arrivalNumber}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === "search" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Search Patient via Binary Search Tree (BST)</h2>
                  <p className="text-xs text-slate-500">
                    Efficiently queries patient nodes using unique Patient ID with O(log n) average time complexity.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
                <input
                  type="text"
                  placeholder="Enter Patient ID (e.g. P-101, P-102)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow-sm transition flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search BST</span>
                </button>
              </form>

              {searchResult && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  {searchResult.found && searchResult.patient ? (
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-blue-600 text-white font-mono px-2 py-0.5 rounded font-bold">
                              {searchResult.patient.id}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900">{searchResult.patient.name}</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Age: {searchResult.patient.age} &bull; Gender: {searchResult.patient.gender} &bull; Arrival #{searchResult.patient.arrivalNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border ${
                            searchResult.patient.status === "TREATED"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : searchResult.patient.status === "WAITING"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}>
                            Status: {searchResult.patient.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-600 block mb-1">Triage Level:</span>
                          <span className={`inline-block px-2 py-0.5 rounded font-bold border ${TRIAGE_LEVELS[searchResult.patient.emergencyLevel].badgeClass}`}>
                            {TRIAGE_LEVELS[searchResult.patient.emergencyLevel].label}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-600 block mb-1">Arrival Time:</span>
                          <span className="font-mono text-slate-800">{new Date(searchResult.patient.arrivalTime).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                        <span className="font-semibold text-slate-700 block mb-1">Symptoms / Condition:</span>
                        <p className="text-slate-800">{searchResult.patient.conditionDescription}</p>
                      </div>

                      {searchResult.patient.doctorNotes && (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                          <span className="font-semibold text-emerald-700 block mb-1">Doctor Treatment Notes:</span>
                          <p className="text-slate-800">{searchResult.patient.doctorNotes}</p>
                        </div>
                      )}

                      {searchResult.patient.status === "WAITING" && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              handleCancelRegistration(searchResult.patient!.id);
                              setSearchResult(null);
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg text-xs border border-red-200 flex items-center space-x-1.5 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Cancel Registration</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs">
                      No patient found in Binary Search Tree with ID &quot;{searchQuery}&quot;. Please verify the patient ID.
                    </div>
                  )}
                </div>
              )}
            </div>

            {}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Network className="h-4 w-4 text-blue-600" />
                <span>BST In-Order Traversal (Sorted by Patient ID)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Left Subtree &rarr; Root &rarr; Right Subtree prints all indexed patients in lexicographical ascending order.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {erSystem.getBSTInOrder().map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSearchQuery(p.id);
                      setSearchResult(erSystem.searchPatient(p.id));
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-mono font-medium transition text-slate-700 flex items-center space-x-1.5"
                  >
                    <span>{p.id}</span>
                    <span className="text-[10px] text-slate-400">({p.name})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <History className="h-5 w-5 text-emerald-600" />
                    <span>Treated Patient History</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                      {historyPatients.length} Records
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maintained chronologically using a Singly Linked List (prepend operations for latest treated first).
                  </p>
                </div>
              </div>

              {historyPatients.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Stethoscope className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No treated patients yet</p>
                  <p className="text-xs text-slate-400">Treat waiting patients from the Emergency Triage tab.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {historyPatients.map((patient, index) => {
                    const triage = TRIAGE_LEVELS[patient.emergencyLevel];
                    return (
                      <div key={patient.id} className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-400">#{index + 1} Node</span>
                            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {patient.id}
                            </span>
                            <span className="font-bold text-sm text-slate-900">{patient.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${triage.badgeClass}`}>
                              Level {patient.emergencyLevel}
                            </span>
                          </div>

                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">Complaint: </span>
                            {patient.conditionDescription}
                          </div>

                          {patient.doctorNotes && (
                            <div className="text-emerald-800 bg-emerald-50/60 border border-emerald-200/60 p-2 rounded">
                              <span className="font-semibold">Treatment Note: </span>
                              {patient.doctorNotes}
                            </div>
                          )}
                        </div>

                        <div className="text-right text-[11px] text-slate-400 space-y-1 shrink-0 font-mono">
                          <div>Treated: {patient.treatedTime ? new Date(patient.treatedTime).toLocaleTimeString() : 'N/A'}</div>
                          <div>Arrival #{patient.arrivalNumber}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {}
        {activeTab === "dsa" && (
          <div className="space-y-6">
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Data Structure 1</span>
                  <Activity className="h-4 w-4 text-red-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Priority Queue</h4>
                <p className="text-xs text-slate-500">
                  Manages emergency triage levels 1 to 5. Higher levels extract first.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">extractNext() &bull; O(1) level sweep</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Data Structure 2</span>
                  <Network className="h-4 w-4 text-blue-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Binary Search Tree</h4>
                <p className="text-xs text-slate-500">
                  Indexes every patient by ID for fast lookup and cancellation operations.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">search(id) &bull; O(log n) avg</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Data Structure 3</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">FIFO Queue</h4>
                <p className="text-xs text-slate-500">
                  Maintains patients of identical priority level in exact arrival order.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">enqueue() / dequeue() &bull; O(1)</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Data Structure 4</span>
                  <History className="h-4 w-4 text-emerald-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Linked List</h4>
                <p className="text-xs text-slate-500">
                  Maintains historical records of treated patients dynamically.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">prepend() &bull; O(1) insertion</div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                  <FileText className="h-4 w-4 text-slate-700" />
                  <span>Real-Time DSA Operation Logs</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{logs.length} operations logged</span>
              </div>

              <div className="h-72 overflow-y-auto space-y-1.5 font-mono text-xs bg-slate-900 p-3 rounded-lg text-slate-300">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2 py-0.5 border-b border-slate-800">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`px-1 rounded font-bold shrink-0 text-[10px] ${
                      log.type === "REGISTER" ? "bg-blue-900 text-blue-300" :
                      log.type === "TREAT" ? "bg-emerald-900 text-emerald-300" :
                      log.type === "CANCEL" ? "bg-red-900 text-red-300" :
                      log.type === "SEARCH" ? "bg-purple-900 text-purple-300" :
                      "bg-slate-800 text-slate-300"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-200 flex-1">{log.message}</span>
                    <span className="text-slate-400 text-[10px] shrink-0">{log.dsaUsed}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        Emergency Patient Management System &bull; Built with Next.js, Tailwind CSS & TypeScript &bull; Project 4
      </footer>
    </div>
  );
}
