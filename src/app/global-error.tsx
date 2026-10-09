"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "2rem",
          textAlign: "center",
          background: "#e6e5dd",
          color: "#191713",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <span
          style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#d2452b",
            border: "1.5px solid currentColor",
            borderRadius: "999px",
            padding: "0.28rem 0.6rem",
            transform: "rotate(-3.5deg)",
          }}
        >
          Error
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: "1.75rem",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          The register could not load
        </h1>
        <p style={{ margin: 0, maxWidth: "34ch", opacity: 0.7 }}>
          A problem stopped the application from starting. Reload the page to
          try again.
        </p>
        {error.digest && (
          <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>
            Reference {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            cursor: "pointer",
            border: "none",
            background: "#191713",
            color: "#f4f3ec",
            font: "inherit",
            padding: "0.6rem 1.1rem",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
