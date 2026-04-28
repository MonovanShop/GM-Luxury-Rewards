import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, ChevronRight } from "lucide-react";
import { TIER_INFO, type Tier } from "@/lib/loyalty";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/customers/")({
  component: CustomersList,
});

type Customer = {
  id: string; code: string; full_name: string; phone: string;
  tier: Tier; purchase_count: number; last_purchase_at: string | null;
};

function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("id,code,full_name,phone,tier,purchase_count,last_purchase_at")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setCustomers(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setCreating(true);

    const payload = { full_name: name.trim(), phone: phone.trim() };
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      setCreating(false);
      toast.error("Vuelve a iniciar sesión para crear clientes.");
      return;
    }

    try {
      const response = await fetch("/api/admin/create-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(result.error ?? "No se pudo registrar el cliente.");
        return;
      }

      toast.success(`Cliente creado · Tarjeta ${result.customer.code}`);
      setName(""); setPhone(""); setOpen(false);
      setCustomers((current) => [result.customer, ...current]);
    } catch {
      toast.error("No se pudo conectar con el backend. Intenta de nuevo.");
    } finally {
      setCreating(false);
    }
  };

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.full_name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-gradient-gold">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu base de clientes premium</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-gold text-background hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> Nuevo cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="glass gold-border">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
              <DialogTitle className="font-display text-2xl text-gradient-gold">Registrar cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={create} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cust-name">Nombre completo</Label>
                  <Input id="cust-name" value={name} onChange={e => setName(e.target.value)}
                    required maxLength={120} autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cust-phone">Teléfono</Label>
                  <Input id="cust-phone" type="tel" inputMode="tel" value={phone}
                    onChange={e => setPhone(e.target.value)} required maxLength={30}
                    autoComplete="tel" />
                </div>
              </div>
              <div className="shrink-0 border-t border-border/40 bg-background/95 backdrop-blur-md px-6 py-4">
                <Button type="submit" disabled={creating}
                  className="w-full bg-gradient-gold text-background hover:opacity-90 font-medium">
                  {creating ? "Creando..." : "Crear cliente"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono o código..."
          className="pl-9" />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {customers.length === 0 ? "Aún no hay clientes. Crea el primero." : "Sin resultados."}
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filtered.map(c => {
              const info = TIER_INFO[c.tier];
              return (
                <Link key={c.id} to="/admin/customers/$id" params={{ id: c.id }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition group">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs tracking-widest font-medium
                    ${c.tier === "black" ? "tier-black-bg text-gold" : c.tier === "elite" ? "tier-elite-bg text-gold-soft" : "tier-classic-bg text-foreground/70"}`}>
                    {info.label.slice(0,3)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{c.full_name}</div>
                    <div className="text-xs text-muted-foreground">{c.phone} · {c.code}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-gold">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{c.purchase_count} compras</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
