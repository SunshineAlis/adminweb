"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AddFoodModal from "@/app/(food-menu)/_features/AddFoodModal";
import Categories from "@/app/(food-menu)/_components/Categories";

type Food = {
  _id?: string;
  foodName: string;
  price: Number;
  ingredients: string;
  image?: string;
};

type Category = {
  _id: string;
  categoryName: string;
};

export default function FoodCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [foodCountByCategory, setFoodCountByCategory] = useState<{
    [categoryId: string]: number;
  }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3030/category");
        if (response.data && Array.isArray(response.data.data)) {
          const cats: Category[] = response.data.data;
          setCategories(cats);
          const counts: { [key: string]: number } = {};
          await Promise.all(
            cats.map(async (cat) => {
              try {
                const res = await axios.get(
                  `http://localhost:3030/foods/${cat._id}/foodCount`
                );
                counts[cat._id] = res.data.count;
              } catch (err) {
                counts[cat._id] = 0;
              }
            })
          );
          setFoodCountByCategory(counts);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddFood = (newFood: Food) => {
    if (selectedCategory) {
      setFoodCountByCategory((prevState) => ({
        ...prevState,
        [selectedCategory]: (prevState[selectedCategory] || 0) + 1,
      }));
      console.log("onAddFood callback triggered with:", newFood);
    }
  };

  const handleDelete = async (catId: string) => {
    try {
      await axios.delete(`http://localhost:3030/category/${catId}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== catId));
      setFoodCountByCategory((prev) => {
        const newCounts = { ...prev };
        delete newCounts[catId];
        return newCounts;
      });
      if (selectedCategory === catId) {
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  return (
    <div className="p-4">
      <Categories
        categories={categories}
        foodCountByCategory={foodCountByCategory}
        setSelectedCategory={setSelectedCategory}
        openAddFoodModal={(catId: string) => {
          setSelectedCategory(catId);
          setShowFoodModal(true);
        }}
        handleDelete={handleDelete}
      />

      {showFoodModal && (
        <AddFoodModal
          selectedCategory={selectedCategory}
          onClose={() => setShowFoodModal(false)}
          onAddFood={handleAddFood}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {successMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 bg-opacity-20 w-[280px] h-10 flex items-center justify-center rounded-xl">
          {successMessage}
        </div>
      )}
    </div>
  );
}
