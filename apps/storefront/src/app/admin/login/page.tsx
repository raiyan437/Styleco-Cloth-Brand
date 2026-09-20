"use client";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ADMIN_CREDENTIALS,
  readAdminSession,
  writeAdminSession,
} from "@/infrastructure/browser/admin-storage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (readAdminSession()) router.replace("/admin");
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter both your username and password.");
      return;
    }
    setBusy(true);
    if (
      username.trim() !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      setBusy(false);
      setError("That username or password is not correct.");
      return;
    }
    writeAdminSession({
      username: "admin",
      role: "admin",
      signedInAt: new Date().toISOString(),
    });
    router.replace("/admin");
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-panel">
        <div className="admin-login-intro">
          <span className="admin-login-mark">S</span>
          <p className="admin-eyebrow">Styleco / Admin studio</p>
          <h1>A quieter way to shape the shop.</h1>
          <p>
            Manage the homepage, catalog, imagery and orders from one focused
            workspace.
          </p>
        </div>
        <form className="admin-login-form" onSubmit={submit}>
          <div className="admin-form-heading">
            <div>
              <p className="admin-eyebrow">Welcome back</p>
              <h2>Sign in to continue</h2>
            </div>
            <ShieldCheck size={21} aria-hidden="true" />
          </div>
          <label className="admin-field">
            <span className="admin-field-label">Username</span>
            <span className="admin-input-with-icon">
              <UserRound size={17} aria-hidden="true" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoFocus
                placeholder="Enter username"
              />
            </span>
          </label>
          <label className="admin-field">
            <span className="admin-field-label">Password</span>
            <span className="admin-input-with-icon">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
              />
              <button
                type="button"
                className="admin-input-action"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {error && (
            <p className="admin-form-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="admin-button admin-button-primary admin-login-submit"
            disabled={busy}
          >
            <LogIn size={17} />{" "}
            {busy ? "Opening workspace…" : "Enter admin studio"}
          </button>
          <p className="admin-login-note">
            Frontend demo access only. Production sessions will be supplied by
            Appwrite Auth later.
          </p>
        </form>
      </div>
      <Link href="/" className="admin-back-storefront">
        Return to storefront
      </Link>
    </main>
  );
}
