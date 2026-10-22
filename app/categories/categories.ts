import { slugify } from "@/lib/slug";

export { slugify };

export type CategoryTone =
  | "rose"
  | "orange"
  | "amber"
  | "yellow"
  | "emerald"
  | "teal"
  | "sky"
  | "violet"
  | "fuchsia";

export type Category = {
  slug: string;
  name: string;
  icon: string;
  count: number;
  tone: CategoryTone;
  products: string[];
};

type ToneStyle = {
  card: string;
  icon: string;
  title: string;
  text: string;
  badge: string;
  badges: string[];
};

export const categories: Category[] = [
  {
    slug: "fresh-flowers",
    name: "Fresh Flowers",
    icon: "🌸",
    count: 24,
    tone: "rose",
    products: ["Red Roses", "Tulip Bunch", "Gerbera Mix", "Orchid Bunch"],
  },
  {
    slug: "bouquets",
    name: "Bouquets",
    icon: "💐",
    count: 18,
    tone: "emerald",
    products: ["Sunset Bouquet", "Pastel Wrap", "Mixed Roses"],
  },
  {
    slug: "flower-cakes",
    name: "Flower Cakes",
    icon: "🎂",
    count: 12,
    tone: "amber",
    products: ["Rose Cake", "Choco Bloom Cake", "Petal Cupcakes"],
  },
  {
    slug: "gajray",
    name: "Gajray",
    icon: "📿",
    count: 9,
    tone: "orange",
    products: ["Jasmine Gajra", "Rose Gajra", "Marigold Gajra", "Mogra Gajra"],
  },
  {
    slug: "blessings",
    name: "Blessings",
    icon: "🙏",
    count: 7,
    tone: "sky",
    products: ["Blessing Bouquet", "Prayer Posy", "Gift Hamper", "Eid Blessing Box"],
  },
  {
    slug: "balloons",
    name: "Balloons",
    icon: "🎈",
    count: 15,
    tone: "fuchsia",
    products: ["Heart Balloons", "Balloon Arch", "Party Pack", "Number Balloons"],
  },
  {
    slug: "chocolates",
    name: "Chocolates",
    icon: "🍫",
    count: 11,
    tone: "yellow",
    products: ["Ferrero Box", "Choco Hearts", "Truffle Tin"],
  },
  {
    slug: "birthday-cards",
    name: "Birthday Cards",
    icon: "💌",
    count: 8,
    tone: "teal",
    products: ["Birthday Card", "Message Card", "Gift Tag", "Thank You Card"],
  },
  {
    slug: "flower-jewelry",
    name: "Flower Jewelry",
    icon: "💍",
    count: 6,
    tone: "violet",
    products: ["Rose Brooch", "Floral Tiara", "Petal Clip"],
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
};

export const allProducts: Product[] = categories.flatMap((category) =>
  category.products.map((name) => ({
    slug: slugify(name),
    name,
    categorySlug: category.slug,
    categoryName: category.name,
  })),
);

export function getProduct(slug: string) {
  return allProducts.find((product) => product.slug === slug);
}

export const categoryTones: Record<CategoryTone, ToneStyle> = {
  rose: {
    card: "bg-rose-50 ring-rose-200 hover:shadow-rose-200/70 hover:ring-rose-300",
    icon: "bg-rose-200 text-rose-900",
    title: "text-rose-900",
    text: "text-rose-700",
    badge: "bg-white text-rose-700 ring-1 ring-rose-200",
    badges: [
      "bg-white/80 text-rose-700 ring-1 ring-rose-200",
      "bg-rose-200 text-rose-900 ring-1 ring-rose-300",
      "text-rose-700 ring-1 ring-rose-400",
    ],
  },
  orange: {
    card: "bg-orange-50 ring-orange-200 hover:shadow-orange-200/70 hover:ring-orange-300",
    icon: "bg-orange-200 text-orange-900",
    title: "text-orange-900",
    text: "text-orange-700",
    badge: "bg-white text-orange-700 ring-1 ring-orange-200",
    badges: [
      "bg-white/80 text-orange-700 ring-1 ring-orange-200",
      "bg-orange-200 text-orange-900 ring-1 ring-orange-300",
      "text-orange-700 ring-1 ring-orange-400",
    ],
  },
  amber: {
    card: "bg-amber-50 ring-amber-200 hover:shadow-amber-200/70 hover:ring-amber-300",
    icon: "bg-amber-200 text-amber-900",
    title: "text-amber-900",
    text: "text-amber-700",
    badge: "bg-white text-amber-700 ring-1 ring-amber-200",
    badges: [
      "bg-white/80 text-amber-700 ring-1 ring-amber-200",
      "bg-amber-200 text-amber-900 ring-1 ring-amber-300",
      "text-amber-700 ring-1 ring-amber-400",
    ],
  },
  yellow: {
    card: "bg-yellow-50 ring-yellow-200 hover:shadow-yellow-200/70 hover:ring-yellow-300",
    icon: "bg-yellow-200 text-yellow-900",
    title: "text-yellow-900",
    text: "text-yellow-800",
    badge: "bg-white text-yellow-800 ring-1 ring-yellow-200",
    badges: [
      "bg-white/80 text-yellow-800 ring-1 ring-yellow-200",
      "bg-yellow-200 text-yellow-900 ring-1 ring-yellow-300",
      "text-yellow-800 ring-1 ring-yellow-400",
    ],
  },
  emerald: {
    card: "bg-emerald-50 ring-emerald-200 hover:shadow-emerald-200/70 hover:ring-emerald-300",
    icon: "bg-emerald-200 text-emerald-900",
    title: "text-emerald-900",
    text: "text-emerald-700",
    badge: "bg-white text-emerald-700 ring-1 ring-emerald-200",
    badges: [
      "bg-white/80 text-emerald-700 ring-1 ring-emerald-200",
      "bg-emerald-200 text-emerald-900 ring-1 ring-emerald-300",
      "text-emerald-700 ring-1 ring-emerald-400",
    ],
  },
  teal: {
    card: "bg-teal-50 ring-teal-200 hover:shadow-teal-200/70 hover:ring-teal-300",
    icon: "bg-teal-200 text-teal-900",
    title: "text-teal-900",
    text: "text-teal-700",
    badge: "bg-white text-teal-700 ring-1 ring-teal-200",
    badges: [
      "bg-white/80 text-teal-700 ring-1 ring-teal-200",
      "bg-teal-200 text-teal-900 ring-1 ring-teal-300",
      "text-teal-700 ring-1 ring-teal-400",
    ],
  },
  sky: {
    card: "bg-sky-50 ring-sky-200 hover:shadow-sky-200/70 hover:ring-sky-300",
    icon: "bg-sky-200 text-sky-900",
    title: "text-sky-900",
    text: "text-sky-700",
    badge: "bg-white text-sky-700 ring-1 ring-sky-200",
    badges: [
      "bg-white/80 text-sky-700 ring-1 ring-sky-200",
      "bg-sky-200 text-sky-900 ring-1 ring-sky-300",
      "text-sky-700 ring-1 ring-sky-400",
    ],
  },
  violet: {
    card: "bg-violet-50 ring-violet-200 hover:shadow-violet-200/70 hover:ring-violet-300",
    icon: "bg-violet-200 text-violet-900",
    title: "text-violet-900",
    text: "text-violet-700",
    badge: "bg-white text-violet-700 ring-1 ring-violet-200",
    badges: [
      "bg-white/80 text-violet-700 ring-1 ring-violet-200",
      "bg-violet-200 text-violet-900 ring-1 ring-violet-300",
      "text-violet-700 ring-1 ring-violet-400",
    ],
  },
  fuchsia: {
    card: "bg-fuchsia-50 ring-fuchsia-200 hover:shadow-fuchsia-200/70 hover:ring-fuchsia-300",
    icon: "bg-fuchsia-200 text-fuchsia-900",
    title: "text-fuchsia-900",
    text: "text-fuchsia-700",
    badge: "bg-white text-fuchsia-700 ring-1 ring-fuchsia-200",
    badges: [
      "bg-white/80 text-fuchsia-700 ring-1 ring-fuchsia-200",
      "bg-fuchsia-200 text-fuchsia-900 ring-1 ring-fuchsia-300",
      "text-fuchsia-700 ring-1 ring-fuchsia-400",
    ],
  },
};
