"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ChatWidget from "@/components/ChatWidget";
import type { Form } from "@/types";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadForm() {
      const { data, error: loadError } = await supabase
        .from("forms")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (!active) return;

      if (loadError || !data) {
        setError("This form does not exist or is not published.");
      } else {
        setForm(data as Form);
      }

      setLoading(false);
    }

    loadForm();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-lg mx-auto py-10">
        <Link
          href="/"
          className="block text-center text-2xl font-bold text-indigo-600 mb-8"
        >
          FormFlow
        </Link>

        {loading ? (
          <p className="text-center">
            Loading form...
          </p>
        ) : error ? (
          <div className="card text-center">
            <h1 className="text-xl font-bold mb-3">
              Form Unavailable
            </h1>

            <p className="text-slate-500">
              {error}
            </p>
          </div>
        ) : form ? (
          <>
            {form.description && (
              <p className="text-center text-slate-600 mb-6">
                {form.description}
              </p>
            )}

            <ChatWidget form={form} />
          </>
        ) : null}
      </div>
    </main>
  );
}