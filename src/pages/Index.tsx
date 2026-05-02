import { useState } from "react";
import { analyzeUrl, type AnalysisResult } from "@/lib/api";

function Navbar() {
  return (
    <header className="border-b border-hairline">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="/" className="font-serif text-2xl font-bold italic tracking-tight text-ink">
          Audience<span className="text-sage">Pulse</span>
        </a>
        <ul className="hidden items-center gap-9 text-[13px] text-ink md:flex">
          <li><a href="#benefits" className="hover:text-muted-ink">Benefits</a></li>
          <li><a href="#how" className="hover:text-muted-ink">How it works</a></li>
          <li><a href="#analyze" className="hover:text-muted-ink">Analyze</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Spinner() {
  return (
    <div className="mx-auto mt-16 flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-hairline border-t-ink" />
      <p className="text-[13px] text-muted-ink">Reading the comments…</p>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const tone =
    clamped >= 70 ? "var(--sage)" : clamped >= 40 ? "var(--neutral-tone)" : "var(--negative)";
  const bg = `conic-gradient(${tone} ${clamped * 3.6}deg, color-mix(in oklab, ${tone} 18%, transparent) 0deg)`;
  return (
    <div className="relative h-44 w-44 shrink-0 rounded-full" style={{ background: bg }}>
      <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card">
        <p className="font-serif text-6xl leading-none text-ink">{clamped}</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">Sentiment</p>
      </div>
    </div>
  );
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: "positive" | "neutral" | "negative" }) {
  const color =
    tone === "positive" ? "bg-sage" : tone === "negative" ? "bg-negative" : "bg-neutral-tone";
  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="text-ink">{label}</span>
        <span className="font-serif text-lg text-ink">{pct}%</span>
      </div>
      <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-stone">
        <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
    </div>
  );
}

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-ink">{title}</p>
      <ul className="mt-5 space-y-4">
        {items.slice(0, 3).map((it, i) => (
          <li key={i} className="flex gap-3 border-b border-hairline pb-4 text-[15px] leading-relaxed text-ink last:border-0">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Results({ data }: { data: AnalysisResult }) {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-ink">Audience summary</p>
        <p className="mt-5 font-serif text-2xl leading-relaxed text-ink md:text-[26px]">
          {data.one_line_summary}
        </p>
      </div>

      <div className="mt-14 grid items-center gap-12 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:justify-start">
          <ScoreRing score={data.sentiment_score} />
        </div>
        <div className="space-y-6">
          <Bar label="Positive" pct={data.positive_percent} tone="positive" />
          <Bar label="Neutral" pct={data.neutral_percent} tone="neutral" />
          <Bar label="Negative" pct={data.negative_percent} tone="negative" />
        </div>
      </div>

      <div className="mt-20 grid gap-12 border-t border-hairline pt-12 md:grid-cols-3">
        <Column title="Top Questions" items={data.top_questions} />
        <Column title="What People Loved" items={data.what_people_loved} />
        <Column title="Top Complaints" items={data.top_complaints} />
      </div>
    </section>
  );
}

export default function Index() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);

  async function handleAnalyze(e?: React.FormEvent) {
    e?.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await analyzeUrl(url.trim());
      setData(result);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch {
      setError("We couldn’t analyze this video right now. Please check the link and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section id="analyze" className="mx-auto max-w-5xl px-6 pt-20 pb-10 text-center md:pt-28">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-ink">YouTube Comment Intelligence</p>
        <h1 className="mx-auto mt-7 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
          Understand what the audience really thinks.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-muted-ink md:text-base">
          Paste a YouTube link and turn thousands of comments into clear sentiment, questions, complaints, and viewer insights.
        </p>

        <form onSubmit={handleAnalyze} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
            className="h-12 flex-1 rounded-full border border-hairline bg-card px-5 text-[14px] text-ink placeholder:text-muted-ink focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-full bg-ink px-7 text-[13px] font-medium tracking-wide text-cream transition hover:bg-ink/85 disabled:opacity-60"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </form>

        {error && (
          <p className="mx-auto mt-6 max-w-md rounded-md border border-negative/30 bg-card px-4 py-3 text-[13px] text-negative">
            {error}
          </p>
        )}
      </section>

      <div id="results" className="px-6 pb-24">
        {loading ? <Spinner /> : data ? <Results data={data} /> : null}
      </div>

      <section id="benefits" className="border-t border-hairline">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-ink">Benefits</p>
            <h2 className="mt-5 font-serif text-5xl leading-tight text-ink">We’ve cracked the code.</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-ink">
              AudiencePulse provides real insights, without the data overload.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            {[
              { t: "Real comments, real signals", d: "We analyze what people actually wrote, not what algorithms guess." },
              { t: "Clarity over dashboards", d: "Results read like a brief you can share, not a chart you have to explain." },
              { t: "Emotion, not just tone", d: "We go beyond positive and negative to show what the audience actually felt." },
              { t: "Instant intelligence", d: "Paste a link. Get answers in seconds. No setup, no exports." },
            ].map((b) => (
              <div key={b.t} className="border-t border-hairline pt-6">
                <h3 className="font-serif text-2xl text-ink">{b.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-ink">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-ink">How it works</p>
          <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-tight text-ink">Three quiet steps.</h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {[
              { n: "01", t: "Paste a link", d: "Drop in any public YouTube URL — long-form, short, or live replay." },
              { n: "02", t: "We listen", d: "Comments are read, grouped, and weighed for tone and intent." },
              { n: "03", t: "You read", d: "An editorial brief: what they asked, what they loved, what they didn’t." },
            ].map((s) => (
              <div key={s.n} className="border-t border-hairline pt-6">
                <p className="font-serif text-3xl text-sage">{s.n}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{s.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-ink">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-[12px] text-muted-ink md:flex-row">
          <p className="font-serif text-xl font-bold italic text-ink">
            Audience<span className="text-sage">Pulse</span>
          </p>
          <p>© {new Date().getFullYear()} AudiencePulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}