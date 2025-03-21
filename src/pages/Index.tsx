
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ItemsSection from "@/components/items/ItemsSection";
import { useHomePageItems } from "@/hooks/useHomePageItems";

const Index = () => {
  const { items, isLoading } = useHomePageItems();

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <ItemsSection items={items} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
