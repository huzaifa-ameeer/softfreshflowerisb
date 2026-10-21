import FeaturedProducts from "@/components/FeaturedProducts";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroCarousel />
      <FeaturedProducts />
    </main>
  );
}
