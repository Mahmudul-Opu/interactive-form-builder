"use client";

import AuthGuard from "@/components/AuthGuard";
import FormEditor from "@/components/FormEditor";

export default function NewFormPage() {
  return (
    <AuthGuard>
      <FormEditor />
    </AuthGuard>
  );
}