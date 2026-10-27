"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ChatWidget from "@/components/ChatWidget";
import type { Form } from "@/types";

export default function EmbedPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("forms")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (!active) return;

      setForm(data as Form | null);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        Loading...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-5 text-center text-slate-500">
        Form unavailable.
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <ChatWidget form={form} />
    </main>
  );
}