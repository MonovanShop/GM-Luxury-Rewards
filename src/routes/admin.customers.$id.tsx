import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { TIER_INFO, type Tier } from "@/lib/loyalty";
import { ArrowLeft, Plus, Trash2, QrCode, Download, Copy, Save } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/admin/customers/$id")({
  component: CustomerDetail,
});

type Customer = {
  id: string; code: string; full_name: string; phone: string;
  tier: Tier; purchase_count: number; last_purchase_at: string | null; notes: string | null;
};
type Purchase = { id: string; description: string | null; created_at: string };

function CustomerDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseDesc, setPurchaseDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const { data: c } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
    if (!c) return;
    setCustomer(c as Customer);
    const { data: p } = await supabase.from("purchases").select("*").eq("customer_id", id).order("created_at", { ascending: false });
    setPurchases((p ?? []) as Purchase[]);
  };

  useEffect(() => { load(); }, [id]);

  const cardUrl = customer ? `${typeof window !== "undefined" ? window.location.origin : ""}/loyalty/${customer.code}` : "";

  const addPurchase = async () => {
    setSaving(true);
    const { error } = await supabase.from("purchases").insert({
      customer_id: id, description: purchaseDesc.trim() || null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setPurchaseDesc("");
    toast.success("Compra registrada");
    load();
  };

  const deletePurchase = async (pid: string) => {
    if (!confirm("¿Eliminar esta compra?")) return;
    const { error } = await supabase.from("purchases").delete().eq("id", pid);
    if (error) { toast.error(error.message); return; }
    toast.success("Compra eliminada");
    load();
  };

  const updateCustomer = async (patch: Partial<Customer>) => {
    if (!customer) return;
    const { error } = await supabase.from("customers").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Actualizado");
    load();
  };

  const deleteCustomer = async () => {
    if (!confirm("¿Eliminar este cliente y todo su historial?")) return;
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Cliente eliminado");
    router.navigate({ to: "/admin/customers" });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(cardUrl);
    toast.success("Enlace copiado");
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gm-luxury-${customer?.code}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!customer) return <div className="text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-8 fade-in-up">
      <Link to="/admin/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: card + QR */}
        <div className="space-y-6">
          <LoyaltyCard tier={customer.tier} fullName={customer.full_name}
            code={customer.code} purchaseCount={customer.purchase_count} />

          <div className="glass rounded-2xl p-6 gold-border">
            <h3 className="font-display text-xl text-gradient-gold flex items-center gap-2">
              <QrCode className="w-5 h-5" /> Código QR del cliente
            </h3>
            <p className="text-xs text-muted-foreground mt-1">El cliente escanea y abre su tarjeta directamente.</p>
            <div ref={qrRef} className="mt-4 bg-white p-4 rounded-xl flex justify-center">
              <QRCodeSVG value={cardUrl} size={200} level="H" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Descargar
              </Button>
              <Button onClick={copyLink} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" /> Copiar enlace
              </Button>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground break-all font-mono">{cardUrl}</div>
          </div>
        </div>

        {/* Right: data + purchases */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-gradient-gold mb-4">Datos del cliente</h3>
            <CustomerForm customer={customer} onSave={updateCustomer} />
            <div className="mt-6 pt-6 border-t border-border/40">
              <Button variant="ghost" onClick={deleteCustomer} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar cliente
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-gradient-gold mb-1">Registrar compra</h3>
            <p className="text-xs text-muted-foreground mb-4">Cada compra suma +1 al nivel del cliente automáticamente.</p>
            <div className="flex gap-2">
              <Input placeholder="Descripción opcional (ej. Tenis Balenciaga)"
                value={purchaseDesc} onChange={e => setPurchaseDesc(e.target.value)} maxLength={200} />
              <Button onClick={addPurchase} disabled={saving} className="bg-gradient-gold text-background shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Sumar
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-gradient-gold mb-4">Historial ({purchases.length})</h3>
            {purchases.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin compras todavía.</p>
            ) : (
              <ul className="divide-y divide-border/40 -mx-2">
                {purchases.map(p => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-2 py-3">
                    <div className="min-w-0">
                      <div className="text-sm truncate">{p.description || "Compra"}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                    </div>
                    <button onClick={() => deletePurchase(p.id)}
                      className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerForm({ customer, onSave }: { customer: Customer; onSave: (p: Partial<Customer>) => void }) {
  const [name, setName] = useState(customer.full_name);
  const [phone, setPhone] = useState(customer.phone);
  const [tier, setTier] = useState<Tier>(customer.tier);
  const [notes, setNotes] = useState(customer.notes ?? "");

  useEffect(() => {
    setName(customer.full_name); setPhone(customer.phone);
    setTier(customer.tier); setNotes(customer.notes ?? "");
  }, [customer]);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input value={name} onChange={e => setName(e.target.value)} maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input value={phone} onChange={e => setPhone(e.target.value)} maxLength={30} />
      </div>
      <div className="space-y-2">
        <Label>Nivel (manual)</Label>
        <Select value={tier} onValueChange={v => setTier(v as Tier)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">{TIER_INFO.classic.name}</SelectItem>
            <SelectItem value="elite">{TIER_INFO.elite.name}</SelectItem>
            <SelectItem value="black">{TIER_INFO.black.name}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[11px] text-muted-foreground">Se recalcula automáticamente al sumar/quitar compras.</p>
      </div>
      <div className="space-y-2">
        <Label>Notas internas</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} maxLength={500} />
      </div>
      <Button onClick={() => onSave({ full_name: name, phone, tier, notes: notes || null })}
        className="bg-gradient-gold text-background">
        <Save className="w-4 h-4 mr-2" /> Guardar cambios
      </Button>
    </div>
  );
}
