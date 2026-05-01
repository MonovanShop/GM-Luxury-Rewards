import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Minus, PlusCircle } from "lucide-react";
import { tierFromCount, tierMeta, progressToNext, type Tier } from "@/lib/tier";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/")({
  component: CustomersPage,
});

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  card_code: string;
  purchases_count: number;
  notes: string | null;
  created_at: string;
};

function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Customer[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      c.full_name.toLowerCase().includes(q)
      || c.card_code.toLowerCase().includes(q)
      || (c.email ?? "").toLowerCase().includes(q)
      || (c.phone ?? "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const stats = useMemo(() => {
    const counts: Record<Tier, number> = { classic: 0, elite: 0, black: 0 };
    items.forEach((c) => { counts[tierFromCount(c.purchases_count)]++; });
    return counts;
  }, [items]);

  const adjustPurchases = async (c: Customer, delta: number) => {
    const next = Math.max(0, c.purchases_count + delta);
    const { error } = await supabase
      .from("customers")
      .update({ purchases_count: next })
      .eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    const oldTier = tierFromCount(c.purchases_count);
    const newTier = tierFromCount(next);
    if (newTier !== oldTier && delta > 0) toast.success(`${c.full_name} subió a ${tierMeta(newTier).label}`);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("customers").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Cliente eliminado");
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-gradient-gold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "cliente" : "clientes"} · Classic {stats.classic} ·
            Elite {stats.elite} · Black {stats.black}
          </p>
        </div>
        <Dialog open={creatingOpen} onOpenChange={setCreatingOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Nuevo cliente</Button>
          </DialogTrigger>
          <CustomerFormDialog
            mode="create"
            onClose={() => setCreatingOpen(false)}
            onSaved={() => { setCreatingOpen(false); load(); }}
          />
        </Dialog>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, código, email o teléfono"
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Cargando…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-card/40 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {items.length === 0 ? "Aún no hay clientes. Crea el primero." : "Sin resultados."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => {
            const tier = tierFromCount(c.purchases_count);
            const prog = progressToNext(c.purchases_count);
            return (
              <div
                key={c.id}
                className="grid gap-4 rounded-lg border border-border/70 bg-card/40 p-4 sm:grid-cols-[1.4fr_1fr_auto]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{c.full_name}</p>
                    <TierBadge tier={tier} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{c.card_code}</p>
                  {(c.email || c.phone) ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[c.email, c.phone].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{c.purchases_count} compras</span>
                    <span className="text-muted-foreground">
                      {prog.nextLabel ? `${prog.remaining} para ${prog.nextLabel}` : "Máximo nivel"}
                    </span>
                  </div>
                  <Progress value={prog.percent} className="mt-2 h-2" />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button size="icon" variant="outline" onClick={() => adjustPurchases(c, -1)} disabled={c.purchases_count === 0} aria-label="Restar compra">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={() => adjustPurchases(c, +1)} aria-label="Sumar compra">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => setEditing(c)} aria-label="Editar">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => setDeleteId(c.id)} aria-label="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing ? (
          <CustomerFormDialog
            mode="edit"
            customer={editing}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); load(); }}
          />
        ) : null}
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const map: Record<Tier, string> = {
    classic: "bg-muted text-foreground",
    elite: "bg-gold/20 text-gold border border-gold/40",
    black: "bg-foreground text-background",
  };
  return <Badge className={map[tier]}>{tierMeta(tier).label}</Badge>;
}

function CustomerFormDialog({
  mode, customer, onClose, onSaved,
}: {
  mode: "create" | "edit";
  customer?: Customer;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(customer?.full_name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [purchases, setPurchases] = useState<number>(customer?.purchases_count ?? 0);
  const [notes, setNotes] = useState(customer?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    try {
      if (mode === "create") {
        const { error } = await supabase.from("customers").insert({
          full_name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          purchases_count: Math.max(0, purchases | 0),
          notes: notes.trim() || null,
          card_code: "",
        });
        if (error) throw error;
        toast.success("Cliente creado");
      } else if (customer) {
        const { error } = await supabase.from("customers").update({
          full_name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          purchases_count: Math.max(0, purchases | 0),
          notes: notes.trim() || null,
        }).eq("id", customer.id);
        if (error) throw error;
        toast.success("Cliente actualizado");
      }
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "Nuevo cliente" : "Editar cliente"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Nombre completo *">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} required className="input" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} className="input" />
          </Field>
          <Field label="Teléfono">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} className="input" />
          </Field>
        </div>
        <Field label="Compras realizadas">
          <input
            type="number" min={0} max={9999}
            value={purchases}
            onChange={(e) => setPurchases(Math.max(0, parseInt(e.target.value || "0", 10)))}
            className="input"
          />
        </Field>
        <Field label="Notas">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={3} className="input resize-none" />
        </Field>
        {customer ? (
          <p className="text-xs text-muted-foreground">
            Código de tarjeta: <span className="font-mono">{customer.card_code}</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">El código de tarjeta se genera automáticamente.</p>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
        </DialogFooter>
      </form>
      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);color:var(--foreground);border-radius:6px;padding:.55rem .65rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--gold)}`}</style>
    </DialogContent>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
