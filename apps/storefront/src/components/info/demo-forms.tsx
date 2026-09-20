"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
export function DemoAuthForm({ register = false }: { register?: boolean }) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <div className="auth-card">
      <p className="text-eyebrow">YOUR STYLECO WORLD</p>
      <h1>
        {register ? "Make yourself\nat home." : "Good to see\nyou again."}
      </h1>
      <p className="muted">
        Sign in to keep your saved pieces, bag and order details together. Enter
        your details below to continue.
      </p>
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          const values = new FormData(e.currentTarget);
          const nextErrors: Record<string, string> = {};
          const name = String(values.get("name") ?? "").trim();
          const email = String(values.get("email") ?? "").trim();
          const password = String(values.get("password") ?? "");
          if (register && name.length < 2) nextErrors.name = "Enter your name.";
          if (!email.includes("@")) {
            nextErrors.email = "Enter a valid email address.";
          }
          if (password.length < 8) {
            nextErrors.password = "Use at least 8 characters.";
          }
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length > 0) return;
          e.currentTarget.reset();
          setMessage(
            register
              ? "Your account is ready. Welcome to Styleco."
              : "You’re all set. Welcome back to your Styleco account.",
          );
        }}
      >
        {register && (
          <label className="field-label">
            Name
            <input
              name="name"
              required
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span className="field-error" id="name-error">
                {errors.name}
              </span>
            )}
          </label>
        )}
        <label className="field-label">
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span className="field-error" id="email-error">
              {errors.email}
            </span>
          )}
        </label>
        <label className="field-label">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="8 or more characters"
            autoComplete="off"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span className="field-error" id="password-error">
              {errors.password}
            </span>
          )}
        </label>
        <button type="submit" className="button full-width">
          {register ? "Create account" : "Sign in"}
          <ArrowUpRight size={18} />
        </button>
        <p role="status">{message}</p>
      </form>
      <Link className="underlined" href="/account">
        Continue to your account
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      className="stack-form contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const values = new FormData(e.currentTarget);
        const nextErrors: Record<string, string> = {};
        const name = String(values.get("name") ?? "").trim();
        const email = String(values.get("email") ?? "").trim();
        const message = String(values.get("message") ?? "").trim();
        if (name.length < 2) nextErrors.name = "Enter your name.";
        if (!email.includes("@"))
          nextErrors.email = "Enter a valid email address.";
        if (message.length < 10)
          nextErrors.message = "Tell us a little more (10 characters minimum).";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        setSent(true);
        e.currentTarget.reset();
      }}
      noValidate
    >
      <label className="field-label">
        Your name
        <input
          name="name"
          required
          placeholder="How should we call you?"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <span className="field-error" id="contact-name-error">
            {errors.name}
          </span>
        )}
      </label>
      <label className="field-label">
        Email address
        <input
          name="email"
          required
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <span className="field-error" id="contact-email-error">
            {errors.email}
          </span>
        )}
      </label>
      <label className="field-label">
        What’s on your mind?
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Tell us a little more…"
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
        />
        {errors.message && (
          <span className="field-error" id="contact-message-error">
            {errors.message}
          </span>
        )}
      </label>
      <button type="submit" className="button">
        Send message <ArrowUpRight size={18} />
      </button>
      <p role="status" className="muted">
        {sent
          ? "Thanks for getting in touch. We’ll be back in touch soon."
          : "We’ll get back to you as soon as we can."}
      </p>
    </form>
  );
}
