import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

function destinationFromCode(rawCode: string | null) {
  const code = (rawCode ?? "").trim().toUpperCase();
  if (!code) return "/";
  if (code === "ADM" || code === "ADMIN") return "/admin/login";
  return `/loyalty/${encodeURIComponent(code)}`;
}

export const Route = createFileRoute("/loyalty")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        return Response.redirect(new URL(destinationFromCode(url.searchParams.get("code")), url.origin), 302);
      },
    },
  },
  component: LoyaltyRedirect,
});

function LoyaltyRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);
    window.location.replace(destinationFromCode(url.searchParams.get("code")));
  }, []);

  return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Abriendo tarjeta...</div>;
}