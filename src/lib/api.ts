export const ANALYZE_WEBHOOK_URL =
  "https://n8n-production-8931.up.railway.app/webhook/yt-analyze-v2";

export type AnalysisResult = {
  sentiment_score: number;
  positive_percent: number;
  negative_percent: number;
  neutral_percent: number;
  top_questions: string[];
  top_complaints: string[];
  what_people_loved: string[];
  one_line_summary: string;
};

export const SAMPLE_RESULT: AnalysisResult = {
  sentiment_score: 78,
  positive_percent: 64,
  neutral_percent: 24,
  negative_percent: 12,
  top_questions: [
    "What camera setup are you using?",
    "Can you share the editing workflow?",
    "Will there be a part two?",
  ],
  what_people_loved: [
    "Cinematic visuals and color grading",
    "Honest, unhurried storytelling",
    "Practical, real-world examples",
  ],
  top_complaints: [
    "Audio levels feel uneven",
    "Pacing slows mid-video",
    "Wanted more depth on pricing",
  ],
  one_line_summary:
    "Viewers responded warmly to the cinematic tone and honest storytelling, with curiosity dominating the conversation.",
};

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  const endpoint = `${ANALYZE_WEBHOOK_URL}?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint, { method: "GET" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = (await res.json()) as AnalysisResult;
  return data;
}
