import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import heroImg from "@/assets/hero.jpg";
import { categories, formatBRL, menu, type CategoryId } from "@/data/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xis do Sul | Xis, pizza, sushi e açaí em Porto Alegre" },
      {
        name: "description",
        content:
          "Delivery em Porto Alegre: xis gaúcho, pizza artesanal, barcas de sushi, baurus, bolos e açaí. Entrega em até 40 minutos e frete grátis acima de R$ 60.",
      },
      {
        property: "og:title",
        content: "Xis do Sul | Delivery em Porto Alegre",
      },
      {
        property: "og:description",
        content:
          "Xis, pizzas, barcas de sushi, baurus, bolos e açaí feitos na hora. Entrega em até 40 minutos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Cart = Record<string, number>;

const FREE_SHIPPING_FROM = 60;
const DELIVERY_FEE = 8;

const filters: { id: CategoryId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
];

function Index() {
  const [active, setActive] = useState<CategoryId | "todos">("todos");
  const [cart, setCart] = useState<Cart>({});

  const visibleItems = useMemo(
    () => (active === "todos" ? menu : menu.filter((i) => i.category === active)),
    [active],
  );

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const item = menu.find((m) => m.id === id);
          return item ? { item, qty } : null;
        })
        .filter((l): l is { item: (typeof menu)[number]; qty: number } => l !== null),
    [cart],
  );

  const itemCount = useMemo(
    () => cartLines.reduce((n, l) => n + l.qty, 0),
    [cartLines],
  );

  const subtotal = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.item.price * l.qty, 0),
    [cartLines],
  );

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : DELIVERY_FEE;

  const add = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }, []);

  const remove = useCallback((id: string) => {
    setCart((c) => {
      const next = { ...c };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#topo" className="text-lg font-extrabold tracking-tight">
            Xis <span className="text-primary">do Sul</span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#cardapio">
              Cardápio
            </a>
            <a className="transition-colors hover:text-foreground" href="#pedido">
              Meu pedido
            </a>
            <a className="transition-colors hover:text-foreground" href="#entrega">
              Entrega
            </a>
          </nav>
          <a
            href="#pedido"
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
          </a>
        </div>
      </header>

      <main id="topo">
        {/* Hero */}
        <section className="relative">
          <img
            src={heroImg}
            alt="Xis gaúcho, pizza artesanal e açaí sobre mesa de madeira escura"
            width={1600}
            height={900}
            fetchPriority="high"
            className="h-[62vh] min-h-[380px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-12">
              <span className="inline-block rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
                Delivery em Porto Alegre
              </span>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Xis, pizza, barca de sushi e bolo na sua porta.
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                Feito na hora, entregue em até 40 minutos. Frete grátis nos pedidos
                acima de {formatBRL(FREE_SHIPPING_FROM)}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#cardapio"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ver cardápio
                </a>
                <a
                  href="#entrega"
                  className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Área de entrega
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Nossas especialidades
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActive(c.id);
                  document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-primary"
              >
                <img
                  src={c.image}
                  alt={c.label}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{c.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Cardápio */}
        <section id="cardapio" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Cardápio</h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                aria-pressed={active === f.id}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
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
              <li
                key={item.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
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
                  <button
                    type="button"
                    onClick={() => add(item.id)}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Adicionar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Pedido */}
        <section id="pedido" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold tracking-tight">Seu pedido</h2>
            {cartLines.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Seu carrinho está vazio. Escolha um xis, uma barca de sushi ou um bolo.
              </p>
            ) : (
              <>
                <ul className="mt-4 divide-y divide-border">
                  {cartLines.map(({ item, qty }) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatBRL(item.price)} · un.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Remover um ${item.name}`}
                          onClick={() => remove(item.id)}
                          className="h-8 w-8 rounded-full border border-border transition-colors hover:bg-secondary"
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">{qty}</span>
                        <button
                          type="button"
                          aria-label={`Adicionar um ${item.name}`}
                          onClick={() => add(item.id)}
                          className="h-8 w-8 rounded-full border border-border transition-colors hover:bg-secondary"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-1 text-sm">
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
              </>
            )}
          </div>
        </section>

        {/* Entrega */}
        <section id="entrega" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Entrega rápida",
                d: "Média de 40 minutos em Porto Alegre, Canoas e Viamão.",
              },
              {
                t: "Pagamento fácil",
                d: "Pix, cartão na entrega ou dinheiro. Sem taxa escondida.",
              },
              {
                t: "Aberto todo dia",
                d: "De terça a domingo, das 18h às 00h.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sabor da Esquina · Porto Alegre / RS
        </div>
      </footer>
    </div>
  );
}
