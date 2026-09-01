import xisImg from "@/assets/cat-xis.jpg";
import pizzaImg from "@/assets/cat-pizza.jpg";
import acaiImg from "@/assets/cat-acai.jpg";
import sushiImg from "@/assets/cat-sushi.jpg";
import burgerImg from "@/assets/cat-burger.jpg";
import boloImg from "@/assets/cat-bolo.jpg";
import comboImg from "@/assets/cat-combo.jpg";

export type CategoryId =
  | "combos"
  | "xis"
  | "pizzas"
  | "acai"
  | "sushi"
  | "hamburgueres"
  | "bolos";

export type Addon = { id: string; name: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
};

export const categories: {
  id: CategoryId;
  label: string;
  image: string;
  blurb: string;
}[] = [
  { id: "combos", label: "Combos", image: comboImg, blurb: "Muita comida por pouco dinheiro." },
  { id: "xis", label: "Xis", image: xisImg, blurb: "Na chapa, pão fresco e muito queijo." },
  { id: "pizzas", label: "Pizzas", image: pizzaImg, blurb: "Massa artesanal fermentada 48h." },
  { id: "acai", label: "Açaí", image: acaiImg, blurb: "Cremoso, batido na hora." },
  { id: "sushi", label: "Barcas de sushi", image: sushiImg, blurb: "Peças frescas montadas na hora." },
  { id: "hamburgueres", label: "Hambúrgueres", image: burgerImg, blurb: "Blend 180g na chapa, pão brioche." },
  { id: "bolos", label: "Bolos", image: boloImg, blurb: "Fatia ou inteiro, feitos na casa." },
];

/** Preços praticados em delivery (iFood/Rappi) na região de Balneário Camboriú. */
export const menu: MenuItem[] = [
  // Combos (promoção)
  { id: "combo-casal", name: "Combo Casal", description: "2 Xis Salada + 2 refrigerantes 600ml. Serve duas pessoas.", price: 39.9, category: "combos" },
  { id: "combo-pizza-refri", name: "Combo Pizza + Refri 2L", description: "Pizza grande de mussarela ou calabresa + Guaraná 2L.", price: 44.9, category: "combos" },
  { id: "combo-burger-fritas", name: "Combo Burger + Fritas", description: "Cheeseburger 180g, porção de fritas e refrigerante 600ml.", price: 29.9, category: "combos" },
  { id: "combo-sushi", name: "Combo Barca 30 peças", description: "30 peças variadas + 2 refrigerantes 600ml.", price: 79.9, category: "combos" },
  { id: "combo-acai-familia", name: "Combo Açaí Família", description: "1L de açaí com 4 acompanhamentos + fatia de bolo.", price: 34.9, category: "combos" },
  { id: "combo-galera", name: "Combo da Galera", description: "2 pizzas grandes + 4 xis + Coca 2L. Serve até 6 pessoas.", price: 99.9, category: "combos" },

  // Xis
  { id: "xis-salada", name: "Xis Salada", description: "Hambúrguer 180g, queijo, alface, tomate e maionese da casa.", price: 29.9, category: "xis" },
  { id: "xis-coracao", name: "Xis Coração", description: "Coração de frango na chapa, queijo e salada completa.", price: 39.9, category: "xis" },
  { id: "xis-bacon", name: "Xis Bacon", description: "Hambúrguer, bacon crocante, ovo e cheddar.", price: 36.9, category: "xis" },
  { id: "xis-tudo", name: "Xis Tudo", description: "Carne, frango, bacon, ovo, queijo, presunto e salada.", price: 45.9, category: "xis" },

  // Pizzas
  { id: "pizza-mussarela", name: "Pizza Mussarela G", description: "Molho de tomate, mussarela e orégano. 8 fatias.", price: 44.9, category: "pizzas" },
  { id: "pizza-calabresa", name: "Pizza Calabresa G", description: "Calabresa fatiada, cebola e azeitona. 8 fatias.", price: 49.9, category: "pizzas" },
  { id: "pizza-portuguesa", name: "Pizza Portuguesa G", description: "Presunto, ovo, cebola, ervilha e mussarela.", price: 54.9, category: "pizzas" },
  { id: "pizza-frango-catupiry", name: "Pizza Frango c/ Catupiry G", description: "Frango desfiado e catupiry cremoso.", price: 56.9, category: "pizzas" },

  // Açaí
  { id: "acai-300", name: "Açaí 300ml", description: "Açaí cremoso com dois acompanhamentos.", price: 16.9, category: "acai" },
  { id: "acai-500", name: "Açaí 500ml", description: "Açaí cremoso com três acompanhamentos.", price: 22.9, category: "acai" },
  { id: "acai-700", name: "Açaí 700ml", description: "Açaí cremoso com quatro acompanhamentos.", price: 28.9, category: "acai" },
  { id: "acai-familia", name: "Açaí Família 1L", description: "Para dividir, com granola, banana e leite condensado.", price: 42.9, category: "acai" },

  // Barcas de sushi
  { id: "barca-20", name: "Barca 20 peças", description: "Sashimi, uramaki e hossomaki de salmão.", price: 79.9, category: "sushi" },
  { id: "barca-40", name: "Barca 40 peças", description: "Mix de frios e quentes, ideal para dois.", price: 139.9, category: "sushi" },
  { id: "barca-60", name: "Barca 60 peças", description: "Salmão, atum, camarão empanado e hot rolls.", price: 199.9, category: "sushi" },
  { id: "barca-especial", name: "Barca Especial 80 peças", description: "Seleção do sushiman com joy e niguiri maçaricado.", price: 259.9, category: "sushi" },

  // Hambúrgueres
  { id: "burger-classico", name: "Cheeseburger Clássico", description: "Blend 180g, cheddar, picles e molho da casa no pão brioche.", price: 28.9, category: "hamburgueres" },
  { id: "burger-bacon", name: "Bacon Burger", description: "Blend 180g, cheddar duplo e bacon crocante.", price: 34.9, category: "hamburgueres" },
  { id: "burger-salada", name: "Burger Salada", description: "Blend 180g, queijo prato, alface, tomate e maionese verde.", price: 30.9, category: "hamburgueres" },
  { id: "burger-duplo", name: "Duplo Smash", description: "Dois blends 120g smash, cheddar duplo e cebola caramelizada.", price: 39.9, category: "hamburgueres" },

  // Bolos
  { id: "bolo-fatia-chocolate", name: "Fatia de Bolo de Chocolate", description: "Massa fofinha com recheio de brigadeiro.", price: 12.9, category: "bolos" },
  { id: "bolo-cenoura", name: "Bolo de Cenoura com Chocolate", description: "Inteiro 1,2kg, cobertura generosa de chocolate.", price: 59.9, category: "bolos" },
  { id: "bolo-ninho-morango", name: "Bolo Ninho com Morango", description: "Inteiro 1,5kg, creme de leite ninho e morangos.", price: 84.9, category: "bolos" },
  { id: "bolo-prestigio", name: "Bolo Prestígio", description: "Inteiro 1,2kg, chocolate com recheio de coco.", price: 74.9, category: "bolos" },
];

/** Adicionais por categoria, com preço praticado em delivery. */
export const addonsByCategory: Record<CategoryId, Addon[]> = {
  combos: [
    { id: "cb-fritas", name: "Porção de fritas extra", price: 12.9 },
    { id: "cb-bacon", name: "Bacon extra", price: 6.5 },
    { id: "cb-sobremesa", name: "Fatia de bolo de chocolate", price: 9.9 },
  ],
  xis: [
    { id: "x-bacon", name: "Bacon extra", price: 6.5 },
    { id: "x-cheddar", name: "Cheddar cremoso", price: 5 },
    { id: "x-ovo", name: "Ovo frito", price: 3 },
    { id: "x-catupiry", name: "Catupiry", price: 5.5 },
    { id: "x-hamburguer", name: "Hambúrguer extra 180g", price: 12 },
    { id: "x-fritas", name: "Porção de fritas", price: 14.9 },
  ],
  pizzas: [
    { id: "p-borda-catupiry", name: "Borda recheada catupiry", price: 9.9 },
    { id: "p-borda-cheddar", name: "Borda recheada cheddar", price: 9.9 },
    { id: "p-bacon", name: "Bacon extra", price: 7 },
    { id: "p-mussarela", name: "Dobro de mussarela", price: 8.5 },
  ],
  acai: [
    { id: "a-granola", name: "Granola", price: 3 },
    { id: "a-leite-ninho", name: "Leite Ninho", price: 4.5 },
    { id: "a-nutella", name: "Nutella", price: 7.9 },
    { id: "a-morango", name: "Morango", price: 5 },
    { id: "a-condensado", name: "Leite condensado", price: 3.5 },
    { id: "a-pacoca", name: "Paçoca", price: 2.5 },
  ],
  sushi: [
    { id: "s-hot", name: "8 hot rolls extras", price: 24.9 },
    { id: "s-salmao", name: "5 sashimis de salmão", price: 22.9 },
    { id: "s-shoyu", name: "Shoyu extra", price: 2.5 },
    { id: "s-cream", name: "Cream cheese extra", price: 6 },
    { id: "s-hashi", name: "Hashi adicional", price: 1.5 },
  ],
  hamburgueres: [
    { id: "h-bacon", name: "Bacon extra", price: 6.5 },
    { id: "h-cheddar", name: "Cheddar cremoso", price: 5 },
    { id: "h-blend", name: "Blend extra 180g", price: 13 },
    { id: "h-fritas", name: "Porção de fritas", price: 14.9 },
    { id: "h-onion", name: "Onion rings", price: 12.9 },
  ],
  bolos: [
    { id: "c-morango", name: "Cobertura de morango", price: 8.9 },
    { id: "c-brigadeiro", name: "Brigadeiros de confeitaria", price: 9.9 },
    { id: "c-vela", name: "Kit vela + faca", price: 4.9 },
    { id: "c-mensagem", name: "Mensagem na placa", price: 5.9 },
  ],
};

/** Bebidas disponíveis em todos os produtos. */
export const drinks: Addon[] = [
  { id: "d-coca-600", name: "Coca-Cola 600ml", price: 8.9 },
  { id: "d-coca-2l", name: "Coca-Cola 2L", price: 14.9 },
  { id: "d-guarana-600", name: "Guaraná Antarctica 600ml", price: 7.9 },
  { id: "d-guarana-2l", name: "Guaraná Antarctica 2L", price: 12.9 },
];

/** Adicionais da categoria + bebidas (disponíveis em todos os produtos). */
export const getAddons = (category: CategoryId): Addon[] => [
  ...addonsByCategory[category],
  ...drinks,
];

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
