"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Loader2, Sparkles, ArrowRight } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What's the difference between *args and **kwargs?",
  "When should I use a lambda vs a normal function?",
  "Explain recursion with a simple example",
  "What are Python generators and why use them?",
  "How do I use map, filter, and reduce?",
];

export function StudyHelp({ context }: { context?: string }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answer) answerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer]);

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setAnswer("");
    if (!q) setQuestion(text);
    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, context: context || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setAnswer(data.answer ?? "");
    } catch {
      setError("Couldn't reach the helper. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  const hasAsked = answer || error;
  const canSubmit = question.trim().length > 0 && !loading;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-40 h-14 rounded-full shadow-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 gap-2 font-medium"
          aria-label="Open study help — ask questions about Python"
        >
          <MessageCircle className="h-5 w-5" />
          Need help?
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l bg-neutral-50/95 sm:max-w-lg"
      >
        <SheetHeader className="space-y-1 border-b border-neutral-200/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Sparkles className="h-4 w-4" />
            </span>
            <SheetTitle className="text-lg">Study help</SheetTitle>
          </div>
          <p className="text-sm text-neutral-600 font-normal">
            Stuck? Ask anything about Python — functions, types, OOP, or examples. Get a clear, friendly answer.
          </p>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden pt-4">
          {/* Suggested questions */}
          {!hasAsked && !loading && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAsk(s)}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-left text-sm text-neutral-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-800"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Your question */}
          <div className="space-y-2">
            <label htmlFor="study-help-input" className="text-sm font-medium text-neutral-700">
              Your question
            </label>
            <Textarea
              id="study-help-input"
              placeholder="e.g. What's the difference between *args and **kwargs?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[88px] resize-none rounded-xl border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400"
              disabled={loading}
            />
            <Button
              onClick={() => handleAsk()}
              disabled={!canSubmit}
              className="w-full rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking…
                </>
              ) : (
                <>
                  Ask
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100"
                onClick={() => { setError(null); handleAsk(question); }}
              >
                Try again
              </Button>
            </div>
          )}

          {/* Answer */}
          {answer && (
            <div
              ref={answerRef}
              className="flex-1 overflow-auto rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Answer
              </p>
              <div className="prose prose-sm max-w-none text-neutral-800 whitespace-pre-wrap leading-relaxed">
                {answer}
              </div>
            </div>
          )}

          {/* Loading placeholder */}
          {loading && (
            <div className="flex flex-1 items-start rounded-xl border border-neutral-200 bg-white p-4">
              <Loader2 className="mr-2 h-5 w-5 shrink-0 animate-spin text-blue-500" />
              <p className="text-sm text-neutral-500">Getting you a clear answer…</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
