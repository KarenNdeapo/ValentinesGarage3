import { useState } from "react";

const MECHANICS = ["Alice Shikongo", "Ben Nghipunya", "Clara Amupolo", "David Kaura"];

const CHECKLIST_ITEMS = [
  "Engine oil check & change",
  "Air filter inspection",
  "Brake pads inspection",
  "Tyre pressure & tread check",
  "Coolant level check",
  "Battery & electrical check",
  "Transmission fluid check",
  "Suspension & steering check",
  "Lights & indicators check",
  "Exhaust system inspection",
  "Fuel system inspection",
  "Windscreen wipers check",
];

const SAMPLE_CHECKINS = [
  {
    id: "V001",
    truckReg: "N-123-WB",
    driver: "Johannes Hamunyela",
    condition: "Fair",
    km: 145800,
    date: "2025-05-15",
    notes: "Front bumper dent, cracked windscreen",
  },
  {
    id: "V002",
    truckReg: "N-456-AB",
    driver: "Petrus Nghoshi",
    condition: "Poor",
    km: 312400,
    date: "2025-05-16",
    notes: "Engine knocking, oil leak observed",
  },
  {
    id: "V003",
    truckReg: "N-789-KH",
    driver: "Maria Shilongo",
    condition: "Good",
    km: 87200,
    date: "2025-05-17",
    notes: "Routine service",
  },
];

function initTasks() {
  const tasks = {};
  SAMPLE_CHECKINS.forEach((v) => {
    tasks[v.id] = {};
    MECHANICS.forEach((m) => {
      tasks[v.id][m] = {
        checked: CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item]: false }), {}),
        notes: "",
      };
    });
  });
  return tasks;
}

const conditionColor = {
  Good: { bg: "#EAF3DE", text: "#3B6D11", border: "#639922" },
  Fair: { bg: "#FAEEDA", text: "#854F0B", border: "#EF9F27" },
  Poor: { bg: "#FCEBEB", text: "#A32D2D", border: "#E24B4A" },
};

export default function App() {
  const [view, setView] = useState("tasks"); // tasks | reports
  const [selectedVehicle, setSelectedVehicle] = useState(SAMPLE_CHECKINS[0].id);
  const [selectedMechanic, setSelectedMechanic] = useState(MECHANICS[0]);
  const [tasks, setTasks] = useState(initTasks);
  const [reportVehicle, setReportVehicle] = useState(SAMPLE_CHECKINS[0].id);
  const [saved, setSaved] = useState(false);

  const vehicle = SAMPLE_CHECKINS.find((v) => v.id === selectedVehicle);
  const reportVehicleObj = SAMPLE_CHECKINS.find((v) => v.id === reportVehicle);
  const currentTask = tasks[selectedVehicle][selectedMechanic];

  function toggleCheck(item) {
    setTasks((prev) => ({
      ...prev,
      [selectedVehicle]: {
        ...prev[selectedVehicle],
        [selectedMechanic]: {
          ...prev[selectedVehicle][selectedMechanic],
          checked: {
            ...prev[selectedVehicle][selectedMechanic].checked,
            [item]: !prev[selectedVehicle][selectedMechanic].checked[item],
          },
        },
      },
    }));
    setSaved(false);
  }

  function setNote(val) {
    setTasks((prev) => ({
      ...prev,
      [selectedVehicle]: {
        ...prev[selectedVehicle],
        [selectedMechanic]: {
          ...prev[selectedVehicle][selectedMechanic],
          notes: val,
        },
      },
    }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function countChecked(vid, mech) {
    return Object.values(tasks[vid][mech].checked).filter(Boolean).length;
  }

  function totalChecked(vid) {
    return MECHANICS.reduce((sum, m) => {
      const items = tasks[vid][m].checked;
      const unique = CHECKLIST_ITEMS.filter((i) => items[i]);
      return sum + unique.length;
    }, 0);
  }

  const cond = conditionColor[vehicle?.condition] || conditionColor.Good;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "var(--color-background-tertiary, #F7F6F3)", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-truck" style={{ fontSize: 22, color: "#fff" }} aria-hidden="true"></i>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 18, color: "var(--color-text-primary)" }}>Valentine's Garage</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Mechanic Task Management</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["tasks", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: view === tab ? "none" : "0.5px solid var(--color-border-secondary)",
                background: view === tab ? "#185FA5" : "var(--color-background-primary)",
                color: view === tab ? "#fff" : "var(--color-text-primary)",
                fontWeight: view === tab ? 500 : 400,
                cursor: "pointer",
                fontSize: 14,
                textTransform: "capitalize",
              }}
            >
              {tab === "tasks" ? "Task Checklist" : "Reports"}
            </button>
          ))}
        </div>
      </div>

      {/* TASK VIEW */}
      {view === "tasks" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)", gap: "1rem" }}>
          {/* Left panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Vehicle selector */}
            <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Vehicle</div>
              {SAMPLE_CHECKINS.map((v) => {
                const total = totalChecked(v.id);
                const pct = Math.round((total / CHECKLIST_ITEMS.length) * 100);
                const c = conditionColor[v.condition];
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      marginBottom: 6,
                      cursor: "pointer",
                      border: selectedVehicle === v.id ? "1.5px solid #185FA5" : "0.5px solid var(--color-border-tertiary)",
                      background: selectedVehicle === v.id ? "#E6F1FB" : "var(--color-background-secondary)",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{v.truckReg}</div>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: c.bg, color: c.text, border: `0.5px solid ${c.border}` }}>{v.condition}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{v.driver}</div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                        <span>Progress</span><span>{pct}%</span>
                      </div>
                      <div style={{ height: 4, background: "var(--color-border-tertiary)", borderRadius: 99 }}>
                        <div style={{ height: 4, width: `${pct}%`, background: pct === 100 ? "#3B6D11" : "#185FA5", borderRadius: 99, transition: "width 0.3s" }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vehicle info card */}
            {vehicle && (
              <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Check-in Details</div>
                {[
                  ["Registration", vehicle.truckReg],
                  ["Driver", vehicle.driver],
                  ["KM Reading", vehicle.km.toLocaleString() + " km"],
                  ["Check-in Date", vehicle.date],
                  ["Condition", vehicle.condition],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>{k}</span>
                    <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{v}</span>
                  </div>
                ))}
                {vehicle.notes && (
                  <div style={{ marginTop: 10, padding: "8px 10px", background: "var(--color-background-secondary)", borderRadius: 6, fontSize: 12, color: "var(--color-text-secondary)", borderLeft: "3px solid #378ADD" }}>
                    <strong>Driver notes:</strong> {vehicle.notes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel — checklist */}
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
                Service Checklist — {vehicle?.truckReg}
              </div>
              <select
                value={selectedMechanic}
                onChange={(e) => setSelectedMechanic(e.target.value)}
                style={{ fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }}
              >
                {MECHANICS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Mechanic tabs summary */}
            <div style={{ display: "flex", gap: 6, marginBottom: "1rem", flexWrap: "wrap" }}>
              {MECHANICS.map((m) => {
                const cnt = countChecked(selectedVehicle, m);
                const isActive = m === selectedMechanic;
                return (
                  <div
                    key={m}
                    onClick={() => setSelectedMechanic(m)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 99,
                      fontSize: 12,
                      cursor: "pointer",
                      border: isActive ? "1.5px solid #185FA5" : "0.5px solid var(--color-border-tertiary)",
                      background: isActive ? "#185FA5" : "var(--color-background-secondary)",
                      color: isActive ? "#fff" : "var(--color-text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {m.split(" ")[0]}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      background: isActive ? "rgba(255,255,255,0.25)" : (cnt > 0 ? "#E6F1FB" : "var(--color-border-tertiary)"),
                      color: isActive ? "#fff" : (cnt > 0 ? "#185FA5" : "var(--color-text-secondary)"),
                      borderRadius: 99,
                      padding: "1px 6px",
                    }}>{cnt}</span>
                  </div>
                );
              })}
            </div>

            {/* Checklist items */}
            <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: "1rem" }}>
              {CHECKLIST_ITEMS.map((item, idx) => {
                const checked = currentTask.checked[item];
                return (
                  <div
                    key={item}
                    onClick={() => toggleCheck(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "9px 10px",
                      borderRadius: 8,
                      marginBottom: 4,
                      cursor: "pointer",
                      background: checked ? "#EAF3DE" : "var(--color-background-secondary)",
                      border: `0.5px solid ${checked ? "#639922" : "var(--color-border-tertiary)"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${checked ? "#3B6D11" : "var(--color-border-secondary)"}`,
                      background: checked ? "#3B6D11" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s",
                    }}>
                      {checked && <i className="ti ti-check" style={{ fontSize: 13, color: "#fff" }} aria-hidden="true"></i>}
                    </div>
                    <span style={{ fontSize: 13, color: checked ? "#3B6D11" : "var(--color-text-primary)", fontWeight: checked ? 500 : 400, textDecoration: checked ? "none" : "none" }}>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>Notes from {selectedMechanic.split(" ")[0]}</div>
              <textarea
                value={currentTask.notes}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe what was done, parts replaced, issues found..."
                rows={3}
                style={{
                  width: "100%",
                  fontSize: 13,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "0.5px solid var(--color-border-secondary)",
                  background: "var(--color-background-secondary)",
                  color: "var(--color-text-primary)",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={handleSave}
              style={{
                padding: "9px 24px",
                borderRadius: 8,
                border: "none",
                background: saved ? "#3B6D11" : "#185FA5",
                color: "#fff",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.2s",
              }}
            >
              <i className={`ti ${saved ? "ti-check" : "ti-device-floppy"}`} style={{ fontSize: 16 }} aria-hidden="true"></i>
              {saved ? "Saved!" : "Save progress"}
            </button>
          </div>
        </div>
      )}

      {/* REPORTS VIEW */}
      {view === "reports" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Vehicle selector */}
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", flexShrink: 0 }}>
                <i className="ti ti-report" style={{ fontSize: 16, marginRight: 6, verticalAlign: "-2px" }} aria-hidden="true"></i>
                Vehicle Report
              </div>
              <select
                value={reportVehicle}
                onChange={(e) => setReportVehicle(e.target.value)}
                style={{ fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }}
              >
                {SAMPLE_CHECKINS.map((v) => (
                  <option key={v.id} value={v.id}>{v.truckReg} — {v.driver}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-in summary */}
          {reportVehicleObj && (() => {
            const c = conditionColor[reportVehicleObj.condition];
            return (
              <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Check-in Condition</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
                  {[
                    ["Registration", reportVehicleObj.truckReg, "ti-truck"],
                    ["Driver", reportVehicleObj.driver, "ti-user"],
                    ["KM at Check-in", reportVehicleObj.km.toLocaleString(), "ti-gauge"],
                    ["Check-in Date", reportVehicleObj.date, "ti-calendar"],
                  ].map(([label, val, icon]) => (
                    <div key={label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        <i className={`ti ${icon}`} style={{ fontSize: 13 }} aria-hidden="true"></i>{label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{val}</div>
                    </div>
                  ))}
                  <div style={{ background: c.bg, borderRadius: 8, padding: "10px 12px", border: `0.5px solid ${c.border}` }}>
                    <div style={{ fontSize: 11, color: c.text, marginBottom: 4 }}>Condition</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{reportVehicleObj.condition}</div>
                  </div>
                </div>
                {reportVehicleObj.notes && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--color-background-secondary)", borderRadius: 6, fontSize: 12, color: "var(--color-text-secondary)", borderLeft: "3px solid #378ADD" }}>
                    <strong>Driver notes at check-in:</strong> {reportVehicleObj.notes}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Employee work report */}
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Work Done by Each Employee</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MECHANICS.map((mech) => {
                const mechTask = tasks[reportVehicle][mech];
                const done = CHECKLIST_ITEMS.filter((i) => mechTask.checked[i]);
                const pct = Math.round((done.length / CHECKLIST_ITEMS.length) * 100);
                const initials = mech.split(" ").map((n) => n[0]).join("");
                return (
                  <div key={mech} style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, color: "#185FA5", flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{mech}</div>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{done.length} of {CHECKLIST_ITEMS.length} tasks completed</div>
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: 600, padding: "3px 12px", borderRadius: 99,
                        background: pct === 100 ? "#EAF3DE" : pct > 0 ? "#E6F1FB" : "var(--color-background-secondary)",
                        color: pct === 100 ? "#3B6D11" : pct > 0 ? "#185FA5" : "var(--color-text-secondary)",
                      }}>{pct}%</span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 5, background: "var(--color-border-tertiary)", borderRadius: 99, marginBottom: 10 }}>
                      <div style={{ height: 5, width: `${pct}%`, background: pct === 100 ? "#3B6D11" : "#378ADD", borderRadius: 99, transition: "width 0.4s" }}></div>
                    </div>

                    {/* Tasks done */}
                    {done.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: mechTask.notes ? 8 : 0 }}>
                        {done.map((item) => (
                          <span key={item} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #97C459" }}>
                            <i className="ti ti-check" style={{ fontSize: 10, marginRight: 3 }} aria-hidden="true"></i>{item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mechanic notes */}
                    {mechTask.notes ? (
                      <div style={{ marginTop: 8, padding: "6px 10px", background: "var(--color-background-secondary)", borderRadius: 6, fontSize: 12, color: "var(--color-text-secondary)", borderLeft: "3px solid #378ADD" }}>
                        <strong>Notes:</strong> {mechTask.notes}
                      </div>
                    ) : (
                      done.length === 0 && (
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontStyle: "italic" }}>No tasks completed yet</div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall summary */}
          {(() => {
            const allDone = new Set();
            const pending = [];
            CHECKLIST_ITEMS.forEach((item) => {
              const anyDone = MECHANICS.some((m) => tasks[reportVehicle][m].checked[item]);
              if (anyDone) allDone.add(item);
              else pending.push(item);
            });
            return (
              <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Overall Progress Summary</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                  {[
                    ["Tasks Complete", allDone.size, "#EAF3DE", "#3B6D11"],
                    ["Tasks Pending", pending.length, "#FCEBEB", "#A32D2D"],
                    ["Mechanics Involved", MECHANICS.filter(m => countChecked(reportVehicle, m) > 0).length, "#E6F1FB", "#185FA5"],
                  ].map(([label, val, bg, color]) => (
                    <div key={label} style={{ background: bg, borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 22, fontWeight: 600, color }}>{val}</div>
                    </div>
                  ))}
                </div>
                {pending.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>Pending tasks:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {pending.map((item) => (
                        <span key={item} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
