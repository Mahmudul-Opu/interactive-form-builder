import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 mt-6">
          <h1 className="text-3xl font-bold mb-4">
            Settings
          </h1>

          <p className="text-slate-600">
            Customize individual chatbot colors, welcome messages,
            and completion messages from the form editor.
          </p>

          <Link
            href="/dashboard"
            className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Manage Forms
          </Link>
        </div>
      </div>
    </main>
  );
}