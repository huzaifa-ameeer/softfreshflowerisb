import mongoose from "mongoose";

const QUERIES = {
  "fresh-flowers": ["rose bouquet", "tulip bouquet", "gerbera flower"],
  bouquets: ["flower bouquet", "rose flower bouquet", "mixed bouquet flowers"],
  "flower-cakes": ["flower cake", "rose cake", "cupcakes flowers"],
  gajray: ["jasmine garland", "marigold garland", "flower garland"],
  blessings: ["white flower bouquet", "lily bouquet", "flower arrangement"],
  balloons: ["balloon bouquet", "heart balloons", "party balloons"],
  chocolates: ["chocolate box", "chocolate truffles", "assorted chocolates"],
  "birthday-cards": ["greeting card", "birthday card", "greeting card flowers"],
  "flower-jewelry": ["hair clip flower", "floral tiara", "flower brooch"],
};

async function searchImages(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php" +
    "?action=query&generator=search&gsrnamespace=6" +
    `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
    "&gsrlimit=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=960&format=json";

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "SoftFreshFlowerSeed/1.0 (https://softfreshflowerisb.example; contact@example.com)",
    },
  });

  if (!response.ok) return [];

  const data = await response.json();
  const pages = data?.query?.pages ?? {};

  return Object.values(pages)
    .map((page) => page?.imageinfo?.[0])
    .filter((info) => info && /^image\/(jpeg|png|webp)$/.test(info.mime))
    .map((info) => info.thumburl || info.url)
    .filter(Boolean);
}

await mongoose.connect(process.env.MONGO_URI);
const products = mongoose.connection.db.collection("products");

const chosen = {};

for (const [category, queries] of Object.entries(QUERIES)) {
  const urls = [];

  for (const query of queries) {
    const found = await searchImages(query);
    if (found[0]) urls.push(found[0]);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const unique = [...new Set(urls)];
  chosen[category] = unique;

  const docs = await products.find({ category }).toArray();

  for (let index = 0; index < docs.length; index += 1) {
    const image = unique[index % Math.max(unique.length, 1)];

    if (!image) continue;

    await products.updateOne(
      { _id: docs[index]._id },
      { $set: { images: [{ url: image, publicId: "" }] } },
    );
  }

  console.log(`${category}: ${unique.length} photos -> ${docs.length} products`);
}

console.log("\nCATEGORY_PHOTOS:");
console.log(JSON.stringify(chosen, null, 2));

await mongoose.disconnect();
