"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f4f0e8",
          color: "#1c1a17",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              STYLECO
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1 }}>
              A little pause in the story.
            </h1>
            <p>Something unexpected happened. Give this page another try.</p>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                padding: "14px 24px",
                background: "#1b1917",
                color: "#fffaf0",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
