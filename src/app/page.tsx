"use client";
import FoodCategory from "@/app/(food-menu)/_features/FoodCategory";
import FoodsByCategory from "@/app/(food-menu)/_features/FoodsByCategory";

export default function Main() {
  return (
    <div className="p-4">
      <FoodCategory />
      <FoodsByCategory />
    </div>
  );
}
