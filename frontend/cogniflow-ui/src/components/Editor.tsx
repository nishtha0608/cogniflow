"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";
import { askQuestion } from "../lib/api";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

const SECTIONS = [
  "Introduction",
  "Literature Review",
  "Methodology",
  "Results",
  "Discussion",
  "Conclusion",
];

export default function Editor() {
  const [section, setSection] = useState(SECTIONS[0]);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReview() {
    setLoading(true);
    setFeedback("Thinking like a supervisor… 🧠");

    try {
      const res = await askQuestion(
        `Review the following ${section} section:\n\n${content}`
      );
      setFeedback(res);
    } catch {
      setFeedback("⚠️ Backend not connected yet.");
    }

    setLoading(false);
  }

  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-4 border-r">
        <div className="flex gap-4 mb-2">
          <select
            className="border px-2 py-1 rounded"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            {SECTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-black text-white px-3 py-1 rounded"
          >
            {loading ? "Reviewing…" : "Supervisor Review"}
          </button>
        </div>

        <MonacoEditor
          height="90%"
          language="markdown"
          theme="vs-dark"
          value={content}
          onChange={(v) => setContent(v ?? "")}
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>

      <div className="w-1/3 p-4 bg-gray-50 overflow-auto">
        <h2 className="font-semibold mb-2">AI Supervisor Feedback</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {feedback || "No feedback yet."}
        </pre>
      </div>
    </div>
  );
}