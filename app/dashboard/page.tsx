"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";
import type { Form } from "@/types";

import {
  Plus,
  FileText,
  MessageSquare,
  Globe,
  Pencil,
  Trash2,
  ExternalLink,
  Copy,
  LogOut,
  Eye,
  Code2,
  LayoutDashboard,
} from "lucide-react";

type FormWithCount = Form & {
  response_count: number;
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const router = useRouter();

  const [forms, setForms] = useState<FormWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadForms = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data, error: formsError } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (formsError) {
      setError(formsError.message);
      setLoading(false);
      return;
    }

    const formList = (data || []) as Form[];

    const formsWithCounts = await Promise.all(
      formList.map(async (form) => {
        const { count } = await supabase
          .from("submissions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("form_id", form.id);

        return {
          ...form,
          response_count: count || 0,
        };
      })
    );

    setForms(formsWithCounts);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function togglePublish(form: Form) {
    const { error: updateError } = await supabase
      .from("forms")
      .update({
        published: !form.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", form.id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    await loadForms();
  }

  async function deleteForm(form: Form) {
    const confirmed = confirm(
      `Are you sure you want to delete "${form.title}"? All its responses will also be deleted.`
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("forms")
      .delete()
      .eq("id", form.id);

    if (deleteError) {
      alert(deleteError.message);
      return;
    }

    await loadForms();
  }

  async function copyPublicUrl(form: Form) {
    const url = `${window.location.origin}/f/${form.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Public URL copied!");
    } catch {
      prompt("Copy this URL:", url);
    }
  }

  async function copyEmbedCode(form: Form) {
    const origin = window.location.origin;

    const code = `<script src="${origin}/embed.js" data-form="${form.slug}"></script>`;

    try {
      await navigator.clipboard.writeText(code);
      alert("Embed code copied!");
    } catch {
      prompt("Copy this embed code:", code);
    }
  }

  const totalResponses = forms.reduce(
    (sum, form) => sum + form.response_count,
    0
  );

  const publishedForms = forms.filter(
    (form) => form.published
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600"
          >
            FormFlow
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-slate-600">
              <LayoutDashboard size={18} />
              Dashboard
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container-custom py-10">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your forms and track responses.
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="btn-primary flex gap-2 items-center"
          >
            <Plus size={18} />
            Create New Form
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 mb-2">
                  Total Forms
                </p>

                <h2 className="text-4xl font-bold">
                  {forms.length}
                </h2>
              </div>

              <FileText
                size={34}
                className="text-indigo-500"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 mb-2">
                  Total Responses
                </p>

                <h2 className="text-4xl font-bold">
                  {totalResponses}
                </h2>
              </div>

              <MessageSquare
                size={34}
                className="text-green-500"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 mb-2">
                  Published Forms
                </p>

                <h2 className="text-4xl font-bold">
                  {publishedForms}
                </h2>
              </div>

              <Globe
                size={34}
                className="text-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Your Forms
            </h2>
          </div>

          {error && (
            <p role="alert" className="text-red-500 mb-5">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-slate-500 py-10 text-center">
              Loading forms...
            </p>
          ) : forms.length === 0 ? (
            <div className="text-center py-16">
              <FileText
                size={60}
                className="text-slate-300 mx-auto mb-5"
              />

              <h3 className="text-xl font-bold mb-2">
                No Forms Yet
              </h3>

              <p className="text-slate-500 mb-6">
                Create your first form to get started.
              </p>

              <Link
                href="/dashboard/new"
                className="btn-primary inline-flex gap-2 items-center"
              >
                <Plus size={18} />
                Create Form
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          {form.title}
                        </h3>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            form.published
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {form.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      <p className="text-slate-500 text-sm mb-3">
                        {form.description || "No description"}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>
                          {form.questions?.length || 0} questions
                        </span>

                        <span>
                          {form.response_count} responses
                        </span>

                        <span>
                          Created{" "}
                          {new Date(
                            form.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-start">
                      <Link
                        href={`/dashboard/forms/${form.id}/edit`}
                        className="btn-secondary flex items-center gap-2 text-sm"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>

                      <Link
                        href={`/dashboard/forms/${form.id}/responses`}
                        className="btn-secondary flex items-center gap-2 text-sm"
                      >
                        <Eye size={16} />
                        Responses
                      </Link>
                    </div>
                  </div>

                  <div className="border-t mt-5 pt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => togglePublish(form)}
                      className={
                        form.published
                          ? "btn-secondary text-sm"
                          : "btn-primary text-sm"
                      }
                    >
                      {form.published
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    {form.published && (
                      <>
                        <button
                          onClick={() => copyPublicUrl(form)}
                          className="btn-secondary flex gap-2 items-center text-sm"
                        >
                          <Copy size={16} />
                          Copy Link
                        </button>

                        <button
                          onClick={() => copyEmbedCode(form)}
                          className="btn-secondary flex gap-2 items-center text-sm"
                        >
                          <Code2 size={16} />
                          Embed Code
                        </button>

                        <a
                          href={`/f/${form.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex gap-2 items-center text-sm"
                        >
                          <ExternalLink size={16} />
                          Open
                        </a>
                      </>
                    )}

                    <button
                      onClick={() => deleteForm(form)}
                      className="text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg flex gap-2 items-center text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}