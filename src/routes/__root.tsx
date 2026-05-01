import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
            Esta versión fue reiniciada desde cero.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GM Luxury Rewards Card" },
      { name: "description", content: "Presentación premium de tarjeta de lealtad para clientes GM Luxury." },
      { name: "author", content: "GM Luxury" },
      { property: "og:title", content: "GM Luxury Rewards Card" },
      { property: "og:description", content: "Presentación premium de tarjeta de lealtad para clientes GM Luxury." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "GM Luxury Rewards Card" },
      { name: "twitter:description", content: "Presentación premium de tarjeta de lealtad para clientes GM Luxury." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa250707-507c-492b-a860-45e9ac42c021/id-preview-60dec45a--a06ea8bd-8f01-4eb9-9589-e502f82ac368.lovable.app-1777342627195.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa250707-507c-492b-a860-45e9ac42c021/id-preview-60dec45a--a06ea8bd-8f01-4eb9-9589-e502f82ac368.lovable.app-1777342627195.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
