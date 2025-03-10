"use client";
import { useState } from 'react';
import Category from '@/components/Category';
import AddFoodModal from "@/components/FoodCards";

export default function Main() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);

  return (
    <div className="p-4">
      <Category
        setSelectedCategory={setSelectedCategory}
        openAddFoodModal={() => setShowFoodModal(true)}
      />

      {showFoodModal && (
        <AddFoodModal
          selectedCategory={selectedCategory}
          onClose={() => setShowFoodModal(false)}
        />
      )}
    </div>
  );
}

