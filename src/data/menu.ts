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

export const menu: MenuItem[] = [
  // Xis
  { id: "xis-salada", name: "Xis Salada", description: "Hambúrguer, queijo, alface, tomate e maionese da casa.", price: 32, category: "xis" },
  { id: "xis-coracao", name: "Xis Coração", description: "Coração de frango na chapa, queijo e salada.", price: 38, category: "xis" },
  { id: "xis-bacon", name: "Xis Bacon", description: "Hambúrguer, bacon crocante, ovo e cheddar.", price: 39, category: "xis" },
  { id: "xis-tudo", name: "Xis Tudo", description: "Carne, frango, bacon, ovo, queijo e salada completa.", price: 46, category: "xis" },

  // Pizzas
  { id: "pizza-mussarela", name: "Pizza Mussarela", description: "Molho de tomate, mussarela e orégano. 8 fatias.", price: 49, category: "pizzas" },
  { id: "pizza-calabresa", name: "Pizza Calabresa", description: "Calabresa fatiada, cebola e azeitona. 8 fatias.", price: 54, category: "pizzas" },
  { id: "pizza-portuguesa", name: "Pizza Portuguesa", description: "Presunto, ovo, cebola, ervilha e mussarela.", price: 58, category: "pizzas" },
  { id: "pizza-frango-catupiry", name: "Pizza Frango com Catupiry", description: "Frango desfiado e catupiry cremoso.", price: 59, category: "pizzas" },

  // Açaí
  { id: "acai-300", name: "Açaí 300ml", description: "Açaí cremoso com dois acompanhamentos.", price: 18, category: "acai" },
  { id: "acai-500", name: "Açaí 500ml", description: "Açaí cremoso com três acompanhamentos.", price: 25, category: "acai" },
  { id: "acai-700", name: "Açaí 700ml", description: "Açaí cremoso com quatro acompanhamentos.", price: 32, category: "acai" },
  { id: "acai-familia", name: "Açaí Família 1L", description: "Para dividir, com granola, banana e leite condensado.", price: 45, category: "acai" },

  // Barcas de sushi
  { id: "barca-20", name: "Barca 20 peças", description: "Sashimi, uramaki e hossomaki de salmão.", price: 89, category: "sushi" },
  { id: "barca-40", name: "Barca 40 peças", description: "Mix de frios e quentes, ideal para dois.", price: 149, category: "sushi" },
  { id: "barca-60", name: "Barca 60 peças", description: "Salmão, atum, camarão empanado e hot rolls.", price: 209, category: "sushi" },
  { id: "barca-especial", name: "Barca Especial 80 peças", description: "Seleção do sushiman com joy e niguiri maçaricado.", price: 279, category: "sushi" },

  // Baurus
  { id: "bauru-tradicional", name: "Bauru Tradicional", description: "Rosbife, queijo derretido, tomate e orégano.", price: 26, category: "baurus" },
  { id: "bauru-frango", name: "Bauru de Frango", description: "Frango desfiado, catupiry e milho.", price: 28, category: "baurus" },
  { id: "bauru-calabresa", name: "Bauru de Calabresa", description: "Calabresa acebolada com queijo prato.", price: 29, category: "baurus" },
  { id: "bauru-completo", name: "Bauru Completo", description: "Presunto, queijo, ovo, bacon e salada.", price: 34, category: "baurus" },

  // Bolos
  { id: "bolo-fatia-chocolate", name: "Fatia de Bolo de Chocolate", description: "Massa fofinha com recheio de brigadeiro.", price: 14, category: "bolos" },
  { id: "bolo-cenoura", name: "Bolo de Cenoura com Chocolate", description: "Inteiro, cobertura generosa de chocolate.", price: 62, category: "bolos" },
  { id: "bolo-ninho-morango", name: "Bolo Ninho com Morango", description: "Inteiro, creme de leite ninho e morangos frescos.", price: 89, category: "bolos" },
  { id: "bolo-prestigio", name: "Bolo Prestígio", description: "Inteiro, chocolate com recheio de coco.", price: 79, category: "bolos" },
];

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
