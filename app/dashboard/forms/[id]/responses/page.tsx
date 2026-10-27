"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";
import type { Form, Submission } from "@/types";

import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  Inbox,
} from "lucide-react";

export default function ResponsesPage() {
  return (
    <AuthGuard>
      <ResponsesContent />
    </AuthGuard>
  );
}

function ResponsesContent() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadResponses() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        if (active) {
          setError("Not authenticated.");
          setLoading(false);
        }
        return;
      }

      const { data: formData, error: formError } =
        await supabase
          .from("forms")
          .select("*")
          .eq("id", id)
          .eq("user_id", userData.user.id)
          .single();

      if (!active) return;

      if (formError || !formData) {
        setError(formError?.message || "Form not found.");
        setLoading(false);
        return;
      }

      setForm(formData as Form);

      const { data: submissionData, error: responseError } =
        await supabase
          .from("submissions")
          .select("*")
          .eq("form_id", id)
          .order("created_at", {
            ascending: false,
          });

      if (!active) return;

      if (responseError) {
        setError(responseError.message);
      } else {
        setResponses((submissionData || []) as Submission[]);
      }

      setLoading(false);
    }

    loadResponses();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container-custom py-5 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft />
          </Link>

          <h1 className="text-xl font-bold">
            Form Responses
          </h1>
        </div>
      </header>

      <div className="container-custom py-10">
        {loading ? (
          <p>Loading responses...</p>
        ) : error ? (
          <p role="alert" className="text-red-500">
            {error}
          </p>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {form?.title}
              </h2>

              <p className="text-slate-500">
                View all submitted answers for this form.
              </p>
            </div>

            <div className="card mb-8 flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <MessageSquare size={28} />
              </div>

              <div>
                <p className="text-slate-500">
                  Total Responses
                </p>

                <h3 className="text-3xl font-bold">
                  {responses.length}
                </h3>
              </div>
            </div>

            {responses.length === 0 ? (
              <div className="card text-center py-16">
                <Inbox
                  size={60}
                  className="mx-auto text-slate-300 mb-5"
                />

                <h3 className="text-xl font-bold mb-2">
                  No Responses Yet
                </h3>

                <p className="text-slate-500">
                  Publish and share your form to start
                  collecting responses.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {responses.map((response, index) => (
                  <div
                    key={response.id}
                    className="card"
                  >
                    <div className="flex flex-wrap gap-3 justify-between items-center border-b pb-4 mb-5">
                      <h3 className="text-lg font-bold">
                        Submission #{responses.length - index}
                      </h3>

                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={16} />

                        {new Date(
                          response.created_at
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-5">
                      {form?.questions.map((question) => (
                        <div key={question.id}>
                          <p className="font-semibold text-slate-700 mb-2">
                            {question.title}
                          </p>

                          <p className="bg-slate-50 p-3 rounded-lg text-slate-600 break-words">
                            {response.answers[question.id] ||
                              "Not answered"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}