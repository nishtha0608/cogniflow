const API_BASE = "http://localhost:8000";

export async function askQuestion(prompt: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/documents/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: prompt }),
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  const data = await res.json();
  return data.answer;
}