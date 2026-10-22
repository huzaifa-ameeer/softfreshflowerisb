import { allProducts, type Product } from "@/app/categories/categories";

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
};

type ProductDetailFields = {
  price: number;
  description: string;
  highlights: string[];
  images: string[];
};

export type ProductDetail = Product &
  ProductDetailFields & {
    rating: number;
    reviews: ProductReview[];
  };

const reviewPool: ProductReview[] = [
  {
    id: "r1",
    author: "Ayesha K.",
    rating: 5,
    date: "2026-09-12",
    title: "Absolutely beautiful",
    body: "Looked even better than the photos and was delivered right on time in F-7.",
  },
  {
    id: "r2",
    author: "Bilal A.",
    rating: 5,
    date: "2026-09-03",
    title: "Great quality",
    body: "Fresh and long lasting. My family loved it, will definitely order again.",
  },
  {
    id: "r3",
    author: "Hina R.",
    rating: 4,
    date: "2026-08-27",
    title: "Lovely, slightly late",
    body: "Beautiful presentation and neat packaging, only a few minutes past the slot.",
  },
  {
    id: "r4",
    author: "Usman T.",
    rating: 5,
    date: "2026-08-19",
    title: "Perfect gift",
    body: "Ordered for my mother's birthday and she adored it. Highly recommended.",
  },
  {
    id: "r5",
    author: "Sana M.",
    rating: 4,
    date: "2026-08-11",
    title: "Worth the price",
    body: "Good value for the size and the little gift card was a nice touch.",
  },
  {
    id: "r6",
    author: "Hamza S.",
    rating: 5,
    date: "2026-08-02",
    title: "Excellent service",
    body: "The team was responsive on WhatsApp and the delivery across the city was smooth.",
  },
  {
    id: "r7",
    author: "Maryam N.",
    rating: 3,
    date: "2026-07-25",
    title: "Nice but a bit small",
    body: "Pretty finish overall, though a touch smaller than I had pictured.",
  },
  {
    id: "r8",
    author: "Zeeshan Q.",
    rating: 5,
    date: "2026-07-18",
    title: "Repeat customer",
    body: "Third order this year and the quality has been consistent every single time.",
  },
  {
    id: "r9",
    author: "Fatima I.",
    rating: 4,
    date: "2026-07-09",
    title: "Very pretty",
    body: "Arrived looking lovely and stayed fresh for days. Packaging could be sturdier.",
  },
  {
    id: "r10",
    author: "Ali R.",
    rating: 5,
    date: "2026-06-30",
    title: "Highly recommend",
    body: "Exactly as described and delivered the same day, which was a lifesaver.",
  },
  {
    id: "r11",
    author: "Nida F.",
    rating: 4,
    date: "2026-06-21",
    title: "Happy customer",
    body: "Ordered on short notice and they still managed a same-day delivery.",
  },
  {
    id: "r12",
    author: "Tariq H.",
    rating: 5,
    date: "2026-06-12",
    title: "Beautiful work",
    body: "The craftsmanship is lovely and the recipient was absolutely thrilled.",
  },
];

const detailsBySlug: Record<string, ProductDetailFields> = {
  "red-roses": {
    price: 2500,
    description:
      "A classic dozen of deep red roses, hand-tied with fresh greens and wrapped in kraft paper.",
    highlights: ["12 long-stem red roses", "Hand-tied with eucalyptus", "Free gift message card"],
    images: ["/1.png", "/2.png", "/3.png"],
  },
  "tulip-bunch": {
    price: 2800,
    description:
      "Ten imported tulips in soft pastel shades, perfect for a gentle surprise.",
    highlights: ["10 fresh tulips", "Imported seasonal stems", "Kraft wrap with ribbon"],
    images: ["/2.png", "/4.png", "/1.png"],
  },
  "gerbera-mix": {
    price: 2200,
    description:
      "Cheerful mixed gerberas in bright colours to brighten up any room.",
    highlights: ["Mixed colour gerberas", "Long-lasting blooms", "Ready-to-gift wrap"],
    images: ["/3.png", "/5.png", "/2.png"],
  },
  "sunset-bouquet": {
    price: 3200,
    description:
      "A warm blend of orange and pink blooms inspired by a summer sunset.",
    highlights: ["Orange roses and lilies", "Warm sunset palette", "Hand-delivered fresh"],
    images: ["/4.png", "/1.png", "/6.png"],
  },
  "pastel-wrap": {
    price: 3000,
    description:
      "Soft pastel roses and carnations, wrapped in matching pastel paper.",
    highlights: ["Pastel roses and carnations", "Soft muted palette", "Personalised card"],
    images: ["/5.png", "/3.png", "/2.png"],
  },
  "mixed-roses": {
    price: 3400,
    description:
      "Two dozen roses in assorted colours for a vibrant, generous arrangement.",
    highlights: ["24 assorted roses", "Lush mixed colours", "Premium presentation"],
    images: ["/6.png", "/2.png", "/4.png"],
  },
  "rose-cake": {
    price: 4500,
    description:
      "Vanilla sponge layered with rose cream and finished with fresh edible petals.",
    highlights: ["Fresh cream rose layers", "Edible flower topping", "Serves 8-10"],
    images: ["/3.png", "/1.png", "/5.png"],
  },
  "choco-bloom-cake": {
    price: 4800,
    description:
      "Rich chocolate cake topped with chocolate blooms and fresh berries.",
    highlights: ["Belgian chocolate sponge", "Chocolate flower decor", "Serves 8-10"],
    images: ["/1.png", "/6.png", "/3.png"],
  },
  "petal-cupcakes": {
    price: 2400,
    description:
      "A box of six cupcakes crowned with buttercream rosettes and petals.",
    highlights: ["Box of 6 cupcakes", "Buttercream rosettes", "Assorted flavours"],
    images: ["/2.png", "/4.png", "/1.png"],
  },
  "jasmine-gajra": {
    price: 800,
    description:
      "Fresh jasmine buds strung by hand, ready to wear for weddings and eids.",
    highlights: ["Fresh jasmine buds", "Hand-strung", "Traditional design"],
    images: ["/5.png", "/3.png", "/6.png"],
  },
  "rose-gajra": {
    price: 900,
    description: "A fragrant rose gajra woven for festive and formal occasions.",
    highlights: ["Fresh rose petals", "Lightweight and fragrant", "Festive favourite"],
    images: ["/6.png", "/1.png", "/4.png"],
  },
  "marigold-gajra": {
    price: 700,
    description: "A classic marigold gajra in bright orange and yellow tones.",
    highlights: ["Vibrant marigolds", "Traditional gajra", "Long-lasting"],
    images: ["/4.png", "/2.png", "/5.png"],
  },
  "blessing-bouquet": {
    price: 2600,
    description:
      "A serene bouquet of white blooms, made for blessings and prayers.",
    highlights: ["White lilies and roses", "Peaceful palette", "Message card included"],
    images: ["/1.png", "/5.png", "/3.png"],
  },
  "prayer-posy": {
    price: 1800,
    description: "A small posy of fresh seasonal flowers for prayer offerings.",
    highlights: ["Compact prayer posy", "Fresh seasonal blooms", "Gentle fragrance"],
    images: ["/2.png", "/6.png", "/1.png"],
  },
  "gift-hamper": {
    price: 5500,
    description:
      "A curated hamper of blooms, chocolates and a greeting card in a gift basket.",
    highlights: ["Flowers and chocolates", "Greeting card", "Gift-ready basket"],
    images: ["/3.png", "/4.png", "/2.png"],
  },
  "heart-balloons": {
    price: 1500,
    description: "A cluster of red heart balloons, inflated and ready to gift.",
    highlights: ["12 heart balloons", "Foil and latex mix", "Helium included"],
    images: ["/4.png", "/1.png", "/6.png"],
  },
  "balloon-arch": {
    price: 6500,
    description:
      "A custom balloon arch to decorate your celebration in the colour of your choice.",
    highlights: ["Custom colour arch", "Setup on request", "Ideal for events"],
    images: ["/5.png", "/2.png", "/3.png"],
  },
  "party-pack": {
    price: 3500,
    description:
      "A party bundle of balloons, a banner, confetti and streamers.",
    highlights: ["Balloons and banner", "Confetti and streamers", "Party-ready bundle"],
    images: ["/6.png", "/3.png", "/5.png"],
  },
  "ferrero-box": {
    price: 4200,
    description: "A premium box of Ferrero Rocher, wrapped and ready to gift.",
    highlights: ["24-piece box", "Golden gift wrap", "Imported chocolates"],
    images: ["/1.png", "/4.png", "/2.png"],
  },
  "choco-hearts": {
    price: 1900,
    description: "Heart-shaped chocolates filled with smooth hazelnut cream.",
    highlights: ["Assorted heart chocolates", "Cream fillings", "Gift pouch"],
    images: ["/2.png", "/5.png", "/1.png"],
  },
  "truffle-tin": {
    price: 3600,
    description:
      "Assorted dark and milk truffles nestled with dried rose buds in a keepsake tin.",
    highlights: ["Mixed truffles", "Keepsake tin", "Dried rose garnish"],
    images: ["/3.png", "/6.png", "/4.png"],
  },
  "birthday-card": {
    price: 400,
    description: "A hand-finished birthday card with a floral illustration.",
    highlights: ["Blank inside", "Floral artwork", "Envelope included"],
    images: ["/4.png", "/2.png", "/5.png"],
  },
  "message-card": {
    price: 300,
    description: "A simple message card to carry your personal note.",
    highlights: ["Your custom message", "Minimal design", "Any occasion"],
    images: ["/5.png", "/1.png", "/6.png"],
  },
  "gift-tag": {
    price: 200,
    description: "A set of three floral gift tags to finish off your present.",
    highlights: ["Set of 3 tags", "Floral print", "String attached"],
    images: ["/6.png", "/3.png", "/2.png"],
  },
  "rose-brooch": {
    price: 1200,
    description:
      "A delicate preserved-rose brooch for a subtle floral touch on any outfit.",
    highlights: ["Preserved roses", "Gold-tone pin", "Lightweight"],
    images: ["/1.png", "/3.png", "/4.png"],
  },
  "floral-tiara": {
    price: 2800,
    description:
      "A floral tiara of preserved blooms for weddings and special occasions.",
    highlights: ["Preserved blooms", "Comfort fit", "Bridal favourite"],
    images: ["/2.png", "/6.png", "/1.png"],
  },
  "petal-clip": {
    price: 900,
    description: "A petal hair clip crafted with real pressed flowers.",
    highlights: ["Real pressed petals", "Secure clip", "Handmade"],
    images: ["/3.png", "/5.png", "/2.png"],
  },
  "blush-rose-bouquet": {
    price: 3600,
    description:
      "Two dozen blush roses hand-tied with eucalyptus and wrapped in kraft paper.",
    highlights: ["24 blush roses", "Hand-tied with eucalyptus", "Kraft wrap with ribbon"],
    images: ["/2.png", "/1.png", "/3.png"],
  },
  "rose-petal-celebration-cake": {
    price: 4600,
    description:
      "Vanilla sponge layered with rose cream and finished with fresh edible petals.",
    highlights: ["Fresh cream rose layers", "Edible flower topping", "Serves 8-10"],
    images: ["/4.png", "/6.png", "/2.png"],
  },
  "chocolate-bloom-box": {
    price: 3900,
    description:
      "Assorted dark and milk truffles arranged with dried rose buds in a keepsake box.",
    highlights: ["Mixed truffles", "Keepsake box", "Dried rose garnish"],
    images: ["/3.png", "/1.png", "/5.png"],
  },
};

const fallbackDetail: ProductDetailFields = {
  price: 2500,
  description:
    "A fresh, hand-arranged selection prepared daily by our florists.",
  highlights: ["Fresh seasonal blooms", "Hand-arranged", "Same-day delivery"],
  images: ["/1.png", "/2.png", "/3.png"],
};

function reviewsFor(index: number) {
  return Array.from(
    { length: 3 },
    (_, offset) => reviewPool[(index * 3 + offset) % reviewPool.length],
  );
}

function averageRating(reviews: ProductReview[]) {
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

const featuredExtras: Product[] = [
  {
    slug: "blush-rose-bouquet",
    name: "Blush Rose Bouquet",
    categorySlug: "bouquets",
    categoryName: "Bouquets",
  },
  {
    slug: "rose-petal-celebration-cake",
    name: "Rose Petal Celebration Cake",
    categorySlug: "flower-cakes",
    categoryName: "Flower Cakes",
  },
  {
    slug: "chocolate-bloom-box",
    name: "Chocolate Bloom Box",
    categorySlug: "chocolates",
    categoryName: "Chocolates",
  },
];

export const catalog: Product[] = [...allProducts, ...featuredExtras];

export const productDetails: ProductDetail[] = catalog.map(
  (product, index) => {
    const fields = detailsBySlug[product.slug] ?? fallbackDetail;
    const reviews = reviewsFor(index);

    return { ...product, ...fields, rating: averageRating(reviews), reviews };
  },
);

export function getProductDetail(slug: string) {
  return productDetails.find((product) => product.slug === slug);
}
