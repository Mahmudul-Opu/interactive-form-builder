"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ChatWidget from "@/components/ChatWidget";
import type { Form, Question, QuestionType } from "@/types";

import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Eye,
  Settings,
  ListChecks,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

interface FormEditorProps {
  initialForm?: Form;
}

export default function FormEditor({
  initialForm,
}: FormEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(
    initialForm?.title || ""
  );

  const [description, setDescription] = useState(
    initialForm?.description || ""
  );

  const [welcomeMessage, setWelcomeMessage] = useState(
    initialForm?.welcome_message ||
      "Hello! 👋 Let's get started."
  );

  const [completionMessage, setCompletionMessage] = useState(
    initialForm?.completion_message ||
      "Thank you for completing this form!"
  );

  const [primaryColor, setPrimaryColor] = useState(
    initialForm?.primary_color || "#6366f1"
  );

  const [questions, setQuestions] = useState<Question[]>(
    initialForm?.questions || []
  );

  const [activeTab, setActiveTab] = useState<
    "questions" | "settings" | "preview"
  >("questions");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addQuestion(type: QuestionType) {
    const question: Question = {
      id: crypto.randomUUID(),
      type,
      title: "",
      required: true,
      options:
        type === "multiple_choice"
          ? ["Option 1", "Option 2"]
          : type === "yes_no"
          ? ["Yes", "No"]
          : [],
    };

    setQuestions([...questions, question]);
  }

  function updateQuestion(
    id: string,
    updates: Partial<Question>
  ) {
    setQuestions(
      questions.map((question) =>
        question.id === id
          ? { ...question, ...updates }
          : question
      )
    );
  }

  function deleteQuestion(id: string) {
    setQuestions(
      questions.filter((question) => question.id !== id)
    );
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= questions.length) {
      return;
    }

    const updated = [...questions];

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setQuestions(updated);
  }

  function updateOption(
    questionId: string,
    optionIndex: number,
    value: string
  ) {
    setQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;

        const options = [...question.options];
        options[optionIndex] = value;

        return { ...question, options };
      })
    );
  }

  function addOption(questionId: string) {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                `Option ${question.options.length + 1}`,
              ],
            }
          : question
      )
    );
  }

  function removeOption(
    questionId: string,
    optionIndex: number
  ) {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(
                (_, index) => index !== optionIndex
              ),
            }
          : question
      )
    );
  }

  async function saveForm() {
    setError("");

    if (!title.trim()) {
      setError("Please enter a form title.");
      return;
    }

    if (title.trim().length > 200) {
      setError("Form title must be at most 200 characters.");
      return;
    }

    if (questions.length === 0) {
      setError("Add at least one question.");
      return;
    }

    for (const question of questions) {
      if (!question.title.trim()) {
        setError("Every question must have a title.");
        return;
      }

      if (
        question.type === "multiple_choice" &&
        (question.options.length < 2 ||
          question.options.some((option) => !option.trim()))
      ) {
        setError(
          "Multiple-choice questions need at least two non-empty options."
        );
        return;
      }

      if (
        question.type === "multiple_choice" &&
        new Set(question.options).size !== question.options.length
      ) {
        setError("Multiple-choice options must be unique.");
        return;
      }
    }

    setSaving(true);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setError("Please log in again.");
      setSaving(false);
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim(),
      questions,
      welcome_message: welcomeMessage,
      completion_message: completionMessage,
      primary_color: primaryColor,
      updated_at: new Date().toISOString(),
    };

    if (initialForm) {
      const { error: updateError } = await supabase
        .from("forms")
        .update(formData)
        .eq("id", initialForm.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const slug = `form-${crypto.randomUUID()}`;

      const { error: insertError } = await supabase
        .from("forms")
        .insert({
          ...formData,
          user_id: userData.user.id,
          slug,
          published: false,
        });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  }

  const previewForm: Form = {
    id: initialForm?.id || "preview",
    user_id: initialForm?.user_id || "preview",
    title: title || "Untitled Form",
    description,
    slug: initialForm?.slug || "preview",
    questions,
    welcome_message: welcomeMessage,
    completion_message: completionMessage,
    primary_color: primaryColor,
    published: false,
    created_at: initialForm?.created_at || "",
    updated_at: "",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container-custom py-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft size={22} />
            </Link>

            <div>
              <h1 className="text-xl font-bold">
                {initialForm ? "Edit Form" : "Create Form"}
              </h1>

              <p className="text-sm text-slate-500">
                Build your interactive chatbot
              </p>
            </div>
          </div>

          <button
            onClick={saveForm}
            disabled={saving}
            className="btn-primary flex gap-2 items-center"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Form"}
          </button>
        </div>
      </header>

      <main className="container-custom py-8">
        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6"
          >
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <div className="card mb-6">
              <label className="label">Form Title *</label>

              <input
                className="input mb-5"
                value={title}
                maxLength={200}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Customer Feedback Form"
              />

              <label className="label">Description</label>

              <textarea
                className="input"
                rows={3}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe your form..."
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab("questions")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
                  activeTab === "questions"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border"
                }`}
              >
                <ListChecks size={18} />
                Questions
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
                  activeTab === "settings"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border"
                }`}
              >
                <Settings size={18} />
                Settings
              </button>

              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
                  activeTab === "preview"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border"
                }`}
              >
                <Eye size={18} />
                Preview
              </button>
            </div>

            {activeTab === "questions" && (
              <div className="space-y-5">
                {questions.map((question, index) => (
                  <div key={question.id} className="card">
                    <div className="flex justify-between items-center mb-5">
                      <span className="bg-indigo-100 text-indigo-600 rounded-full px-3 py-1 text-sm font-semibold">
                        Question {index + 1}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            moveQuestion(index, -1)
                          }
                          disabled={index === 0}
                          title="Move up"
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <ArrowUp size={18} />
                        </button>

                        <button
                          onClick={() =>
                            moveQuestion(index, 1)
                          }
                          disabled={
                            index === questions.length - 1
                          }
                          title="Move down"
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <ArrowDown size={18} />
                        </button>

                        <button
                          onClick={() =>
                            deleteQuestion(question.id)
                          }
                          title="Delete question"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <label className="label">
                      Question Text
                    </label>

                    <input
                      className="input mb-5"
                      placeholder="Enter your question"
                      value={question.title}
                      onChange={(event) =>
                        updateQuestion(question.id, {
                          title: event.target.value,
                        })
                      }
                    />

                    <label className="label">
                      Question Type
                    </label>

                    <select
                      className="input mb-5"
                      value={question.type}
                      onChange={(event) => {
                        const type = event.target
                          .value as QuestionType;

                        updateQuestion(question.id, {
                          type,
                          options:
                            type === "multiple_choice"
                              ? ["Option 1", "Option 2"]
                              : type === "yes_no"
                              ? ["Yes", "No"]
                              : [],
                        });
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="multiple_choice">
                        Multiple Choice
                      </option>
                      <option value="yes_no">Yes / No</option>
                    </select>

                    {question.type === "multiple_choice" && (
                      <div className="mb-5">
                        <label className="label">
                          Answer Options
                        </label>

                        <div className="space-y-2">
                          {question.options.map(
                            (option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex gap-2"
                              >
                                <input
                                  className="input"
                                  value={option}
                                  onChange={(event) =>
                                    updateOption(
                                      question.id,
                                      optionIndex,
                                      event.target.value
                                    )
                                  }
                                />

                                <button
                                  onClick={() =>
                                    removeOption(
                                      question.id,
                                      optionIndex
                                    )
                                  }
                                  disabled={
                                    question.options.length <= 2
                                  }
                                  className="text-red-500 px-3"
                                  aria-label="Remove option"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )
                          )}
                        </div>

                        <button
                          onClick={() => addOption(question.id)}
                          className="text-indigo-600 text-sm font-semibold mt-3 flex items-center gap-1"
                        >
                          <Plus size={16} />
                          Add Option
                        </button>
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(event) =>
                          updateQuestion(question.id, {
                            required: event.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-indigo-600"
                      />

                      <span className="text-sm font-medium">
                        Required Question
                      </span>
                    </label>
                  </div>
                ))}

                <div className="card">
                  <h3 className="font-bold text-lg mb-5">
                    Add Question
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "text", label: "Text" },
                      { type: "email", label: "Email" },
                      {
                        type: "multiple_choice",
                        label: "Multiple Choice",
                      },
                      { type: "yes_no", label: "Yes / No" },
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() =>
                          addQuestion(
                            item.type as QuestionType
                          )
                        }
                        className="border border-dashed border-indigo-300 text-indigo-600 rounded-xl p-4 hover:bg-indigo-50 flex gap-2 items-center justify-center"
                      >
                        <Plus size={18} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="card space-y-6">
                <div>
                  <label className="label">
                    Welcome Message
                  </label>

                  <textarea
                    className="input"
                    rows={3}
                    value={welcomeMessage}
                    onChange={(event) =>
                      setWelcomeMessage(event.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    Completion Message
                  </label>

                  <textarea
                    className="input"
                    rows={3}
                    value={completionMessage}
                    onChange={(event) =>
                      setCompletionMessage(event.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    Chatbot Primary Color
                  </label>

                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(event) =>
                        setPrimaryColor(event.target.value)
                      }
                      className="w-14 h-12 cursor-pointer"
                    />

                    <input
                      className="input"
                      value={primaryColor}
                      onChange={(event) => {
                        const value = event.target.value;

                        if (/^#[0-9a-fA-F]{6}$/.test(value)) {
                          setPrimaryColor(value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="card">
                <h3 className="text-xl font-bold mb-5">
                  Live Preview
                </h3>

                <ChatWidget
                  key={JSON.stringify(previewForm)}
                  form={previewForm}
                  demo
                />
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8">
              <h3 className="text-lg font-bold mb-4">
                Chatbot Preview
              </h3>

              <ChatWidget
                key={JSON.stringify(previewForm)}
                form={previewForm}
                demo
              />

              <p className="text-center text-sm text-slate-400 mt-4">
                Preview responses are not saved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}