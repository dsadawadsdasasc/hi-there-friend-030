import xisImg from "@/assets/cat-xis.jpg";
import pizzaImg from "@/assets/cat-pizza.jpg";
import acaiImg from "@/assets/cat-acai.jpg";
import sushiImg from "@/assets/cat-sushi.jpg";
import bauruImg from "@/assets/cat-bauru.jpg";
import boloImg from "@/assets/cat-bolo.jpg";

export type CategoryId =
  | "xis"
  | "pizzas"
  | "acai"
  | "sushi"
  | "baurus"
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
  { id: "xis", label: "Xis", image: xisImg, blurb: "Na chapa, pão fresco e muito queijo." },
  { id: "pizzas", label: "Pizzas", image: pizzaImg, blurb: "Massa artesanal fermentada 48h." },
  { id: "acai", label: "Açaí", image: acaiImg, blurb: "Cremoso, batido na hora." },
  { id: "sushi", label: "Barcas de sushi", image: sushiImg, blurb: "Peças frescas montadas na hora." },
  { id: "baurus", label: "Baurus", image: bauruImg, blurb: "Clássico no pão francês tostado." },
  { id: "bolos", label: "Bolos", image: boloImg, blurb: "Fatia ou inteiro, feitos na casa." },
];

/** Preços praticados em delivery (iFood/Rappi) na região de Porto Alegre. */
export const menu: MenuItem[] = [
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

  // Baurus
  { id: "bauru-tradicional", name: "Bauru Tradicional", description: "Rosbife, queijo derretido, tomate e orégano.", price: 24.9, category: "baurus" },
  { id: "bauru-frango", name: "Bauru de Frango", description: "Frango desfiado, catupiry e milho.", price: 26.9, category: "baurus" },
  { id: "bauru-calabresa", name: "Bauru de Calabresa", description: "Calabresa acebolada com queijo prato.", price: 27.9, category: "baurus" },
  { id: "bauru-completo", name: "Bauru Completo", description: "Presunto, queijo, ovo, bacon e salada.", price: 32.9, category: "baurus" },

  // Bolos
  { id: "bolo-fatia-chocolate", name: "Fatia de Bolo de Chocolate", description: "Massa fofinha com recheio de brigadeiro.", price: 12.9, category: "bolos" },
  { id: "bolo-cenoura", name: "Bolo de Cenoura com Chocolate", description: "Inteiro 1,2kg, cobertura generosa de chocolate.", price: 59.9, category: "bolos" },
  { id: "bolo-ninho-morango", name: "Bolo Ninho com Morango", description: "Inteiro 1,5kg, creme de leite ninho e morangos.", price: 84.9, category: "bolos" },
  { id: "bolo-prestigio", name: "Bolo Prestígio", description: "Inteiro 1,2kg, chocolate com recheio de coco.", price: 74.9, category: "bolos" },
];

/** Adicionais por categoria, com preço praticado em delivery. */
export const addonsByCategory: Record<CategoryId, Addon[]> = {
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
    { id: "p-refri", name: "Coca-Cola 2L", price: 14.9 },
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
  baurus: [
    { id: "b-queijo", name: "Queijo extra", price: 4.5 },
    { id: "b-bacon", name: "Bacon", price: 6 },
    { id: "b-ovo", name: "Ovo", price: 3 },
    { id: "b-batata", name: "Batata palha", price: 2.5 },
  ],
  bolos: [
    { id: "c-morango", name: "Cobertura de morango", price: 8.9 },
    { id: "c-brigadeiro", name: "Brigadeiros de confeitaria", price: 9.9 },
    { id: "c-vela", name: "Kit vela + faca", price: 4.9 },
    { id: "c-mensagem", name: "Mensagem na placa", price: 5.9 },
  ],
};

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
