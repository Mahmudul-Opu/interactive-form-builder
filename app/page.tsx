"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import type { Form } from "@/types";
import {
  MessageSquare,
  LayoutDashboard,
  Palette,
  Globe,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const demoForm: Form = {
  id: "demo",
  user_id: "demo",
  title: "Product Feedback",
  description: "Tell us what you think!",
  slug: "demo",
  published: true,
  welcome_message:
    "Hi there! 👋 We'd love to hear your feedback. Ready to begin?",
  completion_message:
    "Thank you! Your feedback means a lot to us.",
  primary_color: "#6366f1",
  created_at: "",
  updated_at: "",
  questions: [
    {
      id: "q1",
      type: "text",
      title: "What's your name?",
      required: true,
      options: [],
    },
    {
      id: "q2",
      type: "email",
      title: "What's your email address?",
      required: true,
      options: [],
    },
    {
      id: "q3",
      type: "multiple_choice",
      title: "How would you rate our product?",
      required: true,
      options: ["Excellent", "Good", "Average", "Poor"],
    },
    {
      id: "q4",
      type: "yes_no",
      title: "Would you recommend us to a friend?",
      required: true,
      options: ["Yes", "No"],
    },
  ],
};

const features = [
  {
    icon: MessageSquare,
    title: "Conversational Forms",
    description:
      "Turn traditional forms into engaging, one-question-at-a-time chatbot experiences.",
  },
  {
    icon: LayoutDashboard,
    title: "Powerful Dashboard",
    description:
      "Create forms, manage submissions, and track responses from one place.",
  },
  {
    icon: Palette,
    title: "Easy Customization",
    description:
      "Customize welcome messages, colors, and questions to match your brand.",
  },
  {
    icon: Globe,
    title: "Embed Anywhere",
    description:
      "Add your chatbot to external websites using a simple JavaScript snippet.",
  },
  {
    icon: BarChart3,
    title: "Response Management",
    description:
      "View individual submissions and timestamps in your dashboard.",
  },
  {
    icon: Zap,
    title: "Publish Instantly",
    description:
      "Share forms through unique public links and publish them whenever you're ready.",
  },
];

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24">
        <div className="container-custom grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ✨ The smarter way to collect responses
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Build Forms That
              <span className="text-indigo-600"> Feel Like Conversations</span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Create beautiful interactive forms, embed conversational
              chatbots on your website, and manage every response
              from one powerful dashboard.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary flex gap-2 items-center">
                Start Building Free
                <ArrowRight size={18} />
              </Link>

              <Link href="/#demo" className="btn-secondary">
                Try Live Demo
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 mt-10 text-sm text-slate-600">
              <span className="flex gap-2 items-center">
                <CheckCircle2 className="text-green-500" size={18} />
                Easy to use
              </span>

              <span className="flex gap-2 items-center">
                <CheckCircle2 className="text-green-500" size={18} />
                No coding required
              </span>

              <span className="flex gap-2 items-center">
                <CheckCircle2 className="text-green-500" size={18} />
                Fully responsive
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 bg-indigo-200/40 rounded-3xl blur-3xl" />

            <div className="relative bg-white rounded-3xl shadow-2xl p-4 border border-slate-200">
              <ChatWidget form={demoForm} demo />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="container-custom">
          <h2 className="section-title">
            Everything You Need to Build Better Forms
          </h2>

          <p className="section-description">
            From creation to publishing and response management,
            FormFlow makes the entire process simple.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card hover:shadow-lg transition">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon size={24} />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-slate-100">
        <div className="container-custom">
          <h2 className="section-title">
            How It Works
          </h2>

          <p className="section-description">
            Go from an idea to a published chatbot in four simple steps.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["1", "Create", "Create a form from your dashboard."],
              ["2", "Customize", "Add questions and customize your chatbot."],
              ["3", "Publish", "Publish your form and get a shareable link."],
              ["4", "Collect", "Collect and review responses instantly."],
            ].map(([number, title, text]) => (
              <div key={number} className="card text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {number}
                </div>

                <h3 className="text-xl font-bold mb-3">{title}</h3>

                <p className="text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-24">
        <div className="container-custom">
          <h2 className="section-title">
            Experience the Chatbot
          </h2>

          <p className="section-description">
            Try answering questions in our interactive chatbot demo.
            Demo answers are not saved.
          </p>

          <div className="max-w-lg mx-auto">
            <ChatWidget form={demoForm} demo />
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-5">
            Ready to Create Your First Form?
          </h2>

          <p className="text-indigo-100 mb-8">
            Build conversational forms and start collecting responses today.
          </p>

          <Link
            href="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      <footer id="contact" className="bg-slate-950 text-white py-12">
        <div className="container-custom grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-3">FormFlow</h3>
            <p className="text-slate-400">
              Create interactive conversational forms effortlessly.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3 text-slate-400">
              <Link href="/#features">Features</Link>
              <Link href="/#how-it-works">How It Works</Link>
              <Link href="/#demo">Demo</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-slate-400">
              Have a question? Contact the FormFlow team.
            </p>
            <a
              className="text-indigo-300 mt-3 inline-block"
              href="mailto:support@example.com"
            >
              support@example.com
            </a>
          </div>
        </div>

        <div className="container-custom border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
          © 2026 FormFlow. All rights reserved.
        </div>
      </footer>
    </main>
  );
}