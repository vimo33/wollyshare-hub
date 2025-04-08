
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryIcon from "./CategoryIcon";
import type { ItemCategory } from "@/types/item";

const categories: ItemCategory[] = [
  "tools",
  "kitchen",
  "electronics",
  "sports",
  "books",
  "games",
  "diy-craft",
  "clothing",
  "music", 
  "other"
];

export default function CategoryIconsDemo() {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Category Icons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
          {categories.map((category) => (
            <div key={category} className="flex flex-col items-center gap-2">
              <CategoryIcon
                category={category}
                size="lg"
                isSelected={selectedCategory === category}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              />
              <span className="text-sm capitalize">{category.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-medium mb-4">Size Variations</h3>
          <div className="flex flex-wrap gap-6 items-end justify-center">
            <div className="flex flex-col items-center gap-2">
              <CategoryIcon category="tools" size="sm" />
              <span className="text-xs">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CategoryIcon category="tools" size="md" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CategoryIcon category="tools" size="lg" />
              <span className="text-xs">Large</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CategoryIcon category="tools" size="xl" />
              <span className="text-xs">X-Large</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
