"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FormEditor from "@/components/FormEditor";
import AuthGuard from "@/components/AuthGuard";
import type { Form } from "@/types";

export default function EditFormPage() {
  return (
    <AuthGuard>
      <EditFormContent />
    </AuthGuard>
  );
}

function EditFormContent() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadForm() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        if (active) {
          setError("You must be logged in.");
          setLoading(false);
        }
        return;
      }

      const { data, error: loadError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .eq("user_id", userData.user.id)
        .single();

      if (!active) return;

      if (loadError) {
        setError(loadError.message);
      } else {
        setForm(data as Form);
      }

      setLoading(false);
    }

    loadForm();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading form...
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="p-10 text-center text-red-500">
        {error || "Form not found."}
      </div>
    );
  }

  return <FormEditor initialForm={form} />;
}