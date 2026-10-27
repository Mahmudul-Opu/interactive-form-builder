"use client";

import { useState } from "react";
import { Send, RotateCcw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Form } from "@/types";

interface ChatWidgetProps {
  form: Form;
  demo?: boolean;
}

export default function ChatWidget({
  form,
  demo = false,
}: ChatWidgetProps) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = form.questions || [];
  const currentQuestion = questions[step];

  const progress =
    questions.length > 0
      ? Math.round((step / questions.length) * 100)
      : 100;

  const color = /^#[0-9a-fA-F]{6}$/.test(form.primary_color)
    ? form.primary_color
    : "#6366f1";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function submitAnswer(value: string) {
    if (!currentQuestion || submitting || finished) return;

    const answer = value.trim();

    setError("");

    if (currentQuestion.required && !answer) {
      setError("This question is required.");
      return;
    }

    if (
      currentQuestion.type === "email" &&
      answer &&
      !emailRegex.test(answer)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (answer.length > 2000) {
      setError("Your answer must contain at most 2000 characters.");
      return;
    }

    if (
      currentQuestion.type === "multiple_choice" &&
      answer &&
      !currentQuestion.options.includes(answer)
    ) {
      setError("Please select a valid option.");
      return;
    }

    if (
      currentQuestion.type === "yes_no" &&
      answer &&
      !["Yes", "No"].includes(answer)
    ) {
      setError("Please select Yes or No.");
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };

    if (step < questions.length - 1) {
      setAnswers(updatedAnswers);
      setStep(step + 1);
      setInput("");
      return;
    }

    setSubmitting(true);

    if (!demo) {
      const { error: submitError } = await supabase
        .from("submissions")
        .insert({
          form_id: form.id,
          answers: updatedAnswers,
        });

      if (submitError) {
        setError(submitError.message);
        setSubmitting(false);
        return;
      }
    }

    setAnswers(updatedAnswers);
    setFinished(true);
    setSubmitting(false);
    setInput("");
  }

  function restart() {
    setStep(0);
    setInput("");
    setAnswers({});
    setFinished(false);
    setError("");
    setSubmitting(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden w-full">
      <div
        className="p-5 text-white"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            🤖
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {form.title}
            </h3>

            <p className="text-sm text-white/80">
              Interactive Chatbot
            </p>
          </div>
        </div>
      </div>

      <div className="h-1 bg-slate-100">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${finished ? 100 : progress}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className="p-5 min-h-[350px] max-h-[450px] overflow-y-auto flex flex-col gap-4">
        <div className="chat-message chat-bot">
          {form.welcome_message}
        </div>

        {questions.slice(0, step).map((question) => (
          <div key={question.id} className="flex flex-col gap-2">
            <div className="chat-message chat-bot">
              {question.title}
            </div>

            <div
              className="chat-message chat-user"
              style={{ backgroundColor: color }}
            >
              {answers[question.id] || "Skipped"}
            </div>
          </div>
        ))}

        {!finished && currentQuestion && (
          <div className="chat-message chat-bot">
            {currentQuestion.title}
            {currentQuestion.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </div>
        )}

        {!finished && questions.length === 0 && (
          <div className="chat-message chat-bot">
            This form has no questions yet.
          </div>
        )}

        {finished && (
          <div className="flex flex-col items-center text-center py-8">
            <CheckCircle2
              size={60}
              className="text-green-500 mb-4"
            />

            <h3 className="text-xl font-bold mb-2">
              All Done!
            </h3>

            <p className="text-slate-600">
              {form.completion_message}
            </p>

            <button
              onClick={restart}
              className="btn-secondary flex items-center gap-2 mt-6"
            >
              <RotateCcw size={16} />
              Start Again
            </button>
          </div>
        )}
      </div>

      {!finished && currentQuestion && (
        <div className="border-t p-4">
          {currentQuestion.type === "text" ||
          currentQuestion.type === "email" ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitAnswer(input);
              }}
              className="flex gap-2"
            >
              <input
                className="input flex-1 min-w-0"
                type={
                  currentQuestion.type === "email"
                    ? "email"
                    : "text"
                }
                placeholder="Type your answer..."
                value={input}
                maxLength={2000}
                onChange={(event) => setInput(event.target.value)}
                required={currentQuestion.required}
                disabled={submitting}
              />

              <button
                type="submit"
                disabled={submitting}
                className="text-white px-4 rounded-xl"
                style={{ backgroundColor: color }}
                aria-label="Send answer"
              >
                <Send size={18} />
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {(currentQuestion.type === "yes_no"
                ? ["Yes", "No"]
                : currentQuestion.options
              ).map((option) => (
                <button
                  key={option}
                  disabled={submitting}
                  onClick={() => submitAnswer(option)}
                  className="border border-slate-200 rounded-xl p-3 text-sm hover:bg-indigo-50 hover:border-indigo-300 transition break-words"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {!currentQuestion.required && (
            <button
              onClick={() => submitAnswer("")}
              disabled={submitting}
              className="text-sm text-slate-500 mt-3 hover:text-indigo-600"
            >
              Skip question
            </button>
          )}

          {error && (
            <p role="alert" className="text-red-500 text-sm mt-3">
              {error}
            </p>
          )}

          <div className="flex justify-between mt-4 text-xs text-slate-400">
            <span>
              Question {step + 1} of {questions.length}
            </span>

            <span>{progress}% completed</span>
          </div>
        </div>
      )}

      {submitting && (
        <div className="p-4 text-center text-slate-500 text-sm">
          Saving your response...
        </div>
      )}

      <div className="text-center py-2 bg-slate-50 text-xs text-slate-400">
        Powered by FormFlow
      </div>
    </div>
  );
}