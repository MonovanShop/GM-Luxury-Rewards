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
    const { error } = await supabase.from("customers").insert({
      full_name: name.trim(), phone: phone.trim(),
    });
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Cliente creado");
    setName(""); setPhone(""); setOpen(false);
    load();
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
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-gradient-gold">Registrar cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={create} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} required maxLength={30} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creating} className="bg-gradient-gold text-background">
                  {creating ? "Creando..." : "Crear cliente"}
                </Button>
              </DialogFooter>
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
