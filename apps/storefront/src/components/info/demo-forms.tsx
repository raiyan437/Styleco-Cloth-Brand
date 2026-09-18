"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
export function DemoAuthForm({ register = false }: { register?: boolean }) {
  const [message, setMessage] = useState("");
  return (
    <div className="auth-card">
      <p className="text-eyebrow">YOUR STYLECO WORLD</p>
      <h1>
        {register ? "Make yourself\nat home." : "Good to see\nyou again."}
      </h1>
      <p className="muted">
        Visual-only account preview. No account is created, and credentials are
        never saved or sent. Use example details.
      </p>
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.currentTarget.reset();
          setMessage(
            "Preview complete. Authentication isn't connected. You can explore the demo account below.",
          );
        }}
      >
        {register && (
          <label className="field-label">
            Name
            <input required placeholder="Your name" autoComplete="off" />
          </label>
        )}
        <label className="field-label">
          Email
          <input
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="off"
          />
        </label>
        <label className="field-label">
          Demo password
          <input
            type="password"
            required
            minLength={8}
            placeholder="8 or more characters"
            autoComplete="off"
          />
        </label>
        <button className="button full-width">
          {register ? "Preview registration" : "Preview sign in"}
          <ArrowUpRight size={18} />
        </button>
        <p role="status">{message}</p>
      </form>
      <Link className="underlined" href="/account">
        Explore the demo account
      </Link>
      <p className="auth-switch">
        {register ? "Already part of the story?" : "New around here?"}{" "}
        <Link href={register ? "/login" : "/register"}>
          {register ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="stack-form contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="field-label">
        Your name
        <input required placeholder="How should we call you?" />
      </label>
      <label className="field-label">
        Email address
        <input required type="email" placeholder="you@example.com" />
      </label>
      <label className="field-label">
        What’s on your mind?
        <textarea
          required
          minLength={10}
          rows={5}
          placeholder="Tell us a little more…"
        />
      </label>
      <button className="button">
        Preview message <ArrowUpRight size={18} />
      </button>
      <p role="status" className="muted">
        {sent
          ? "Your message looks ready. This demo is not connected to a mailbox; nothing was sent."
          : "Demo form. No message will be sent."}
      </p>
    </form>
  );
}
