import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { menu, getAddons } from "@/data/menu";

export const FREE_SHIPPING_FROM = 119.9;
export const SHIPPING_FEE = 9.9;

const lineSchema = z.object({
  itemId: z.string().min(1),
  qty: z.number().int().min(1).max(20),
  addonIds: z.array(z.string().min(1)).max(20).default([]),
  notes: z.string().max(300).default(""),
});

const checkoutSchema = z.object({
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(8).max(20),
  address: z.string().min(5).max(200),
  notes: z.string().max(300).default(""),
  lines: z.array(lineSchema).min(1).max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

const toCents = (value: number) => Math.round(value * 100);

/**
 * Cria o pedido no backend calculando os preços SEMPRE no servidor
 * (nunca confiando nos valores enviados pelo navegador).
 * O pagamento é registrado como "unpaid" e fica pronto para receber
 * a integração do provedor (payment_provider / payment_reference).
 */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data }) => {
    let subtotal = 0;

    const items = data.lines.map((line) => {
      const item = menu.find((m) => m.id === line.itemId);
      if (!item) throw new Error(`Produto inválido: ${line.itemId}`);

      const available = getAddons(item.category);
      const addons = line.addonIds
        .map((id) => available.find((a) => a.id === id))
        .filter((a): a is NonNullable<typeof a> => Boolean(a));

      const unit = item.price + addons.reduce((sum, a) => sum + a.price, 0);
      subtotal += unit * line.qty;

      return {
        item_id: item.id,
        item_name: item.name,
        qty: line.qty,
        unit_price_cents: toCents(unit),
        addons: addons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        notes: line.notes || null,
      };
    });

    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        address: data.address,
        notes: data.notes || null,
        subtotal_cents: toCents(subtotal),
        shipping_cents: toCents(shipping),
        total_cents: toCents(total),
      })
      .select("id")
      .single();

    if (error || !order) throw new Error("Não foi possível criar o pedido.");

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error("Não foi possível registrar os itens do pedido.");
    }

    return {
      orderId: order.id,
      subtotal,
      shipping,
      total,
      // Próximo passo: aqui entra a criação da sessão de pagamento
      // do provedor e a devolução da URL de checkout.
      paymentUrl: null as string | null,
    };
  });
