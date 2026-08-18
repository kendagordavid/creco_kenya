"use client";

import { useEffect, useMemo, useState } from "react";
import { CHECKLIST_SECTIONS, CHECKLIST_STORAGE_KEY } from "@/lib/content/checklist";
import { loadPersistedData, savePersistedData } from "@/lib/persist-user-data";

function readChecklistProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function ChecklistPanel() {
  const [checked, setChecked] = useState<Record<string, boolean>>(readChecklistProgress);
  const totalItems = useMemo(
    () => CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0),
    [],
  );
  const completed = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    let active = true;
    void loadPersistedData<Record<string, boolean>>(CHECKLIST_STORAGE_KEY, localStorage).then(
      (saved) => {
        if (active && saved) setChecked(saved);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(checked).length === 0) return;
    void savePersistedData(CHECKLIST_STORAGE_KEY, checked, localStorage);
  }, [checked]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-creco-muted">
          Progress: {completed} / {totalItems} items
        </p>
        <button
          type="button"
          className="creco-btn creco-btn-secondary text-sm"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      <div className="space-y-6">
        {CHECKLIST_SECTIONS.map((section) => (
          <div key={section.id} className="creco-card p-6">
            <h2 className="text-lg font-bold text-creco-primary">{section.title}</h2>
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(checked[item.id])}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 rounded border-creco-border text-creco-primary"
                    />
                    <span className={checked[item.id] ? "text-creco-muted line-through" : ""}>
                      {item.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
