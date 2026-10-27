"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Menu, X, MessageSquareText } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <nav className="container-custom flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
        >
          <MessageSquareText size={30} />
          FormFlow
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="hover:text-indigo-600">
            Features
          </Link>

          <Link href="/#how-it-works" className="hover:text-indigo-600">
            How It Works
          </Link>

          <Link href="/#demo" className="hover:text-indigo-600">
            Demo
          </Link>

          <Link href="/#contact" className="hover:text-indigo-600">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>

              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t p-5 flex flex-col gap-4">
          <Link href="/#features" onClick={() => setOpen(false)}>
            Features
          </Link>

          <Link href="/#how-it-works" onClick={() => setOpen(false)}>
            How It Works
          </Link>

          <Link href="/#demo" onClick={() => setOpen(false)}>
            Demo
          </Link>

          <Link href="/#contact" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="btn-primary text-center"
            onClick={() => setOpen(false)}
          >
            {user ? "Dashboard" : "Login"}
          </Link>
        </div>
      )}
    </header>
  );
}