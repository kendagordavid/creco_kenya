"use client";

import { useEffect, useMemo, useState } from "react";
import { CHECKLIST_SECTIONS, CHECKLIST_STORAGE_KEY } from "@/lib/content/checklist";

export function ChecklistPanel() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const totalItems = useMemo(
    () => CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0),
    [],
  );
  const completed = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checked));
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
