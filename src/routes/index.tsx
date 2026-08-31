import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import heroImg from "@/assets/hero.jpg";
import {
  categories,
  formatBRL,
  getAddons,
  menu,
  type CategoryId,
  type MenuItem,
} from "@/data/menu";
import { cart, useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: search["tab"] === "pedido" ? ("pedido" as const) : ("cardapio" as const),
  }),
  head: () => ({
    meta: [
      { title: "Cantinho da Gula | Delivery 24h de xis, pizza, sushi e açaí" },
      {
        name: "description",
        content:
          "Delivery aberto 24 horas, 7 dias por semana em Porto Alegre: xis gaúcho, pizza artesanal, barcas de sushi, baurus, bolos e açaí. Frete grátis acima de R$ 60.",
      },
      { property: "og:title", content: "Cantinho da Gula | Delivery 24h em Porto Alegre" },
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

const FREE_SHIPPING_FROM = 119.9;
const DELIVERY_FEE = 8;

const filters: { id: CategoryId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
];

const lineUnitPrice = (item: MenuItem, addonIds: string[]) =>
  item.price +
  getAddons(item.category)
    .filter((a) => addonIds.includes(a.id))
    .reduce((s, a) => s + a.price, 0);

function Index() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const [active, setActive] = useState<CategoryId | "todos">("todos");
  const lines = useCart();

  const setTab = (next: "cardapio" | "pedido") =>
    navigate({ to: "/", search: { tab: next } });

  const groups = useMemo(
    () =>
      categories
        .filter((c) => active === "todos" || c.id === active)
        .map((c) => ({
          id: c.id,
          label: c.label,
          items: menu.filter((i) => i.category === c.id),
        }))
        .filter((g) => g.items.length > 0),
    [active],
  );

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const item = menu.find((m) => m.id === l.itemId);
          if (!item) return null;
          const addons = getAddons(item.category).filter((a) =>
            l.addonIds.includes(a.id),
          );
          return { line: l, item, addons, total: lineUnitPrice(item, l.addonIds) * l.qty };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [lines],
  );

  const itemCount = detailed.reduce((n, d) => n + d.line.qty, 0);
  const subtotal = detailed.reduce((s, d) => s + d.total, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : DELIVERY_FEE;

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
                <div className="mx-auto w-full max-w-6xl px-4 pb-4 md:pb-6">
                  <span className="inline-block rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
                    Aberto 24/7 · Porto Alegre
                  </span>
                  <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-6xl">
                    Xis, pizza, barca de sushi e bolo na sua porta, a qualquer hora.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-lg">
                    Cozinha aberta 24 horas por dia, 7 dias por semana. Frete grátis acima de {formatBRL(FREE_SHIPPING_FROM)}.
                  </p>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-8 pt-4 md:pt-6">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Cardápio</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Toque em um produto para abrir a página dele e escolher adicionais e
                observações.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActive(f.id)}
                    aria-pressed={active === f.id}
                    className={`truncate rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors sm:rounded-full sm:px-4 ${
                      active === f.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-8">
                {groups.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {group.label}
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <Link
                            to="/produto/$id"
                            params={{ id: item.id }}
                            search={{ line: undefined }}
                            className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary"
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-semibold">{item.name}</span>
                              <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                                {item.description}
                              </span>
                              <span className="mt-1 block text-sm font-bold">
                                {formatBRL(item.price)}
                              </span>
                            </span>
                            <span className="shrink-0 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                              Montar
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

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
                          onClick={() => cart.changeQty(line.lineId, -1)}
                          className="h-8 w-8 rounded-full border border-border hover:bg-secondary"
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={`Aumentar ${item.name}`}
                          onClick={() => cart.changeQty(line.lineId, 1)}
                          className="h-8 w-8 rounded-full border border-border hover:bg-secondary"
                        >
                          +
                        </button>
                        <Link
                          to="/produto/$id"
                          params={{ id: item.id }}
                          search={{ line: line.lineId }}
                          className="ml-auto text-sm font-semibold text-primary"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => cart.remove(line.lineId)}
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
                  onClick={() => setTab("cardapio")}
                  className="mt-5 w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  + Adicionar mais itens
                </button>
                <button
                  type="button"
                  className="mt-3 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Finalizar pedido
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Cantinho da Gula · Porto Alegre / RS · Aberto 24 horas
        </div>
      </footer>

      {itemCount > 0 && (
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
    </div>
  );
}
