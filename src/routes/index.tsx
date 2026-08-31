import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import heroImg from "@/assets/hero.jpg";
import {
  addonsByCategory,
  categories,
  formatBRL,
  menu,
  type CategoryId,
  type MenuItem,
} from "@/data/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xis do Sul | Delivery 24h de xis, pizza, sushi e açaí" },
      {
        name: "description",
        content:
          "Delivery aberto 24 horas, 7 dias por semana em Porto Alegre: xis gaúcho, pizza artesanal, barcas de sushi, baurus, bolos e açaí. Frete grátis acima de R$ 60.",
      },
      { property: "og:title", content: "Xis do Sul | Delivery 24h em Porto Alegre" },
      {
        property: "og:description",
        content:
          "Aberto 24/7. Xis, pizzas, barcas de sushi, baurus, bolos e açaí feitos na hora, com adicionais e observações no pedido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FREE_SHIPPING_FROM = 60;
const DELIVERY_FEE = 8;

type CartLine = {
  lineId: string;
  itemId: string;
  qty: number;
  addonIds: string[];
  notes: string;
};

type Draft = {
  lineId?: string;
  item: MenuItem;
  qty: number;
  addonIds: string[];
  notes: string;
};

const filters: { id: CategoryId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
];

const lineUnitPrice = (item: MenuItem, addonIds: string[]) =>
  item.price +
  addonsByCategory[item.category]
    .filter((a) => addonIds.includes(a.id))
    .reduce((s, a) => s + a.price, 0);

function Index() {
  const [tab, setTab] = useState<"cardapio" | "pedido">("cardapio");
  const [active, setActive] = useState<CategoryId | "todos">("todos");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);

  const visibleItems = useMemo(
    () => (active === "todos" ? menu : menu.filter((i) => i.category === active)),
    [active],
  );

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const item = menu.find((m) => m.id === l.itemId);
          if (!item) return null;
          const addons = addonsByCategory[item.category].filter((a) =>
            l.addonIds.includes(a.id),
          );
          return { line: l, item, addons, total: lineUnitPrice(item, l.addonIds) * l.qty };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [lines],
  );

  const itemCount = useMemo(
    () => detailed.reduce((n, d) => n + d.line.qty, 0),
    [detailed],
  );
  const subtotal = useMemo(
    () => detailed.reduce((s, d) => s + d.total, 0),
    [detailed],
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : DELIVERY_FEE;

  const openNew = useCallback((item: MenuItem) => {
    setDraft({ item, qty: 1, addonIds: [], notes: "" });
  }, []);

  const openEdit = useCallback((line: CartLine, item: MenuItem) => {
    setDraft({
      lineId: line.lineId,
      item,
      qty: line.qty,
      addonIds: line.addonIds,
      notes: line.notes,
    });
  }, []);

  const saveDraft = useCallback(() => {
    if (!draft) return;
    setLines((prev) => {
      if (draft.lineId) {
        return prev.map((l) =>
          l.lineId === draft.lineId
            ? { ...l, qty: draft.qty, addonIds: draft.addonIds, notes: draft.notes }
            : l,
        );
      }
      return [
        ...prev,
        {
          lineId: `${draft.item.id}-${Date.now()}`,
          itemId: draft.item.id,
          qty: draft.qty,
          addonIds: draft.addonIds,
          notes: draft.notes,
        },
      ];
    });
    setDraft(null);
  }, [draft]);

  const changeQty = useCallback((lineId: string, delta: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.lineId !== lineId) return [l];
        const qty = l.qty + delta;
        return qty <= 0 ? [] : [{ ...l, qty }];
      }),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  useEffect(() => {
    if (!draft) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDraft(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft]);

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-lg font-extrabold leading-none tracking-tight">
              Xis <span className="text-primary">do Sul</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              Aberto agora · 24 horas, todos os dias
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTab("pedido")}
            aria-label={`Meu pedido, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-sm sm:font-semibold"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="hidden sm:inline">Pedido</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground sm:static sm:h-auto sm:min-w-0 sm:bg-transparent sm:px-0 sm:text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Abas principais */}
        <div className="mx-auto flex max-w-6xl gap-1 px-4">
          {(
            [
              { id: "cardapio", label: "Cardápio" },
              { id: "pedido", label: `Meu pedido${itemCount ? ` (${itemCount})` : ""}` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        {tab === "cardapio" ? (
          <>
            {/* Hero */}
            <section className="relative">
              <img
                src={heroImg}
                alt="Xis gaúcho, pizza artesanal e açaí sobre mesa de madeira escura"
                width={1600}
                height={900}
                fetchPriority="high"
                className="h-[52vh] min-h-[320px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
              <div className="absolute inset-0 flex items-end">
                <div className="mx-auto w-full max-w-6xl px-4 pb-8">
                  <span className="inline-block rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
                    Aberto 24/7 · Porto Alegre
                  </span>
                  <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-6xl">
                    Xis, pizza, barca de sushi e bolo na sua porta, a qualquer hora.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-lg">
                    Cozinha aberta 24 horas por dia, 7 dias por semana. Frete grátis
                    acima de {formatBRL(FREE_SHIPPING_FROM)}.
                  </p>
                </div>
              </div>
            </section>

            {/* Cardápio */}
            <section className="mx-auto max-w-6xl px-4 py-8">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Cardápio</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Toque em um produto para escolher adicionais e observações.
              </p>

              <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActive(f.id)}
                    aria-pressed={active === f.id}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      active === f.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => openNew(item)}
                      className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary"
                    >
                      <span className="text-xs uppercase tracking-widest text-accent">
                        {categories.find((c) => c.id === item.category)?.label}
                      </span>
                      <h3 className="mt-2 font-semibold">{item.name}</h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold">{formatBRL(item.price)}</span>
                        <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                          Personalizar
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Entrega */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { t: "Aberto 24/7", d: "Atendimento 24 horas por dia, todos os dias do ano." },
                  { t: "Entrega rápida", d: "Média de 40 minutos em Porto Alegre, Canoas e Viamão." },
                  { t: "Pagamento fácil", d: "Pix, cartão na entrega ou dinheiro. Sem taxa escondida." },
                ].map((c) => (
                  <div key={c.t} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold">{c.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Aba do pedido */
          <section className="mx-auto max-w-3xl px-4 py-8">
            <h2 className="text-2xl font-bold tracking-tight">Seu pedido</h2>
            {detailed.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                  Seu carrinho está vazio. Escolha um xis, uma barca de sushi ou um bolo.
                </p>
                <button
                  type="button"
                  onClick={() => setTab("cardapio")}
                  className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Ver cardápio
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-border bg-card p-5">
                <ul className="divide-y divide-border">
                  {detailed.map(({ line, item, addons, total }) => (
                    <li key={line.lineId} className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium">{item.name}</p>
                          {addons.length > 0 && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              + {addons.map((a) => a.name).join(", ")}
                            </p>
                          )}
                          {line.notes && (
                            <p className="mt-1 text-sm italic text-muted-foreground">
                              “{line.notes}”
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 font-semibold">{formatBRL(total)}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Diminuir ${item.name}`}
                          onClick={() => changeQty(line.lineId, -1)}
                          className="h-8 w-8 rounded-full border border-border hover:bg-secondary"
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={`Aumentar ${item.name}`}
                          onClick={() => changeQty(line.lineId, 1)}
                          className="h-8 w-8 rounded-full border border-border hover:bg-secondary"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(line, item)}
                          className="ml-auto text-sm font-semibold text-primary"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLine(line.lineId)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatBRL(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Entrega</dt>
                    <dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <dt>Total</dt>
                    <dd>{formatBRL(subtotal + shipping)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="mt-5 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Finalizar pedido no WhatsApp
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Xis do Sul · Porto Alegre / RS · Aberto 24 horas
        </div>
      </footer>

      {/* Mini aba do pedido */}
      {itemCount > 0 && !draft && (
        <button
          type="button"
          onClick={() => setTab(tab === "pedido" ? "cardapio" : "pedido")}
          className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-lg sm:mx-auto sm:max-w-md"
        >
          <span className="text-sm font-semibold">
            {itemCount} {itemCount === 1 ? "item" : "itens"} ·{" "}
            {formatBRL(subtotal + shipping)}
          </span>
          <span className="text-sm font-bold underline underline-offset-4">
            {tab === "pedido" ? "Continuar comprando" : "Ver pedido"}
          </span>
        </button>
      )}

      {/* Aba de especificações do produto */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Personalizar ${draft.item.name}`}
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card p-5 sm:max-w-lg sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{draft.item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {draft.item.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Fechar"
                className="h-9 w-9 shrink-0 rounded-full border border-border text-lg leading-none"
              >
                ×
              </button>
            </div>

            <h4 className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent">
              Adicionais
            </h4>
            <ul className="mt-2 space-y-1">
              {addonsByCategory[draft.item.category].map((a) => {
                const checked = draft.addonIds.includes(a.id);
                return (
                  <li key={a.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setDraft((d) =>
                            d
                              ? {
                                  ...d,
                                  addonIds: checked
                                    ? d.addonIds.filter((x) => x !== a.id)
                                    : [...d.addonIds, a.id],
                                }
                              : d,
                          )
                        }
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                      <span className="flex-1 text-sm">{a.name}</span>
                      <span className="text-sm font-semibold">+ {formatBRL(a.price)}</span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <h4 className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent">
              Observações
            </h4>
            <textarea
              value={draft.notes}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, notes: e.target.value } : d))
              }
              rows={3}
              maxLength={200}
              placeholder="Ex.: sem cebola, maionese à parte, ponto da carne..."
              className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border border-border px-3 py-2">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() =>
                    setDraft((d) => (d ? { ...d, qty: Math.max(1, d.qty - 1) } : d))
                  }
                  className="text-lg leading-none"
                >
                  −
                </button>
                <span className="w-5 text-center tabular-nums">{draft.qty}</span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() => setDraft((d) => (d ? { ...d, qty: d.qty + 1 } : d))}
                  className="text-lg leading-none"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={saveDraft}
                className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                {draft.lineId ? "Salvar alterações" : "Adicionar"} ·{" "}
                {formatBRL(lineUnitPrice(draft.item, draft.addonIds) * draft.qty)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
