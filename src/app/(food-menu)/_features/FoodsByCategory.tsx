"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenIcon } from "lucide-react";
import AddFoodModal from "@/app/(food-menu)/_features/AddFoodModal";

// Types
type Category = {
  _id: string;
  categoryName: string;
  foods?: Food[];
};

type Food = {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  image?: string;
  categoryId: string;
};

export default function FoodsByCategory() {
  const [categoriesWithFoods, setCategoriesWithFoods] = useState<Category[]>(
    []
  );
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoriesWithFoods();
  }, []);

  const fetchCategoriesWithFoods = async () => {
    try {
      const categoryResponse = await axios.get(
        "http://localhost:3030/category"
      );
      const categories = categoryResponse.data.data;

      const categoriesData = await Promise.all(
        categories.map(async (category: Category) => {
          try {
            const foodResponse = await axios.get<{ foods: Food[] }>(
              `http://localhost:3030/foods/${category._id}/foods`
            );
            return { ...category, foods: foodResponse.data.foods || [] };
          } catch (error) {
            return { ...category, foods: [] };
          }
        })
      );
      setCategoriesWithFoods(categoriesData);
    } catch (error) {
      console.error("Error fetching categories with foods:", error);
    }
  };

  const handleAddFood = (newFood: Food) => {
    setCategoriesWithFoods((prevCategories) =>
      prevCategories.map((category) =>
        category._id === newFood.categoryId
          ? { ...category, foods: [...category.foods, newFood] }
          : category
      )
    );
    setShowAddFoodModal(false);
  };

  const toggleModal = () => {
    setShowAddFoodModal(!showAddFoodModal);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setImagePreview(food.image || null);
  };

  const handleSave = async (updatedFood: Food) => {
    try {
      const formData = new FormData();
      formData.append("foodName", updatedFood.foodName);
      formData.append("price", updatedFood.price.toString());
      formData.append("ingredients", updatedFood.ingredients);

      if (imagePreview && imagePreview.startsWith("data:image")) {
        const blob = await fetch(imagePreview).then((res) => res.blob());
        formData.append("image", blob, "image.png");
      }

      const response = await axios.put(
        `http://localhost:3030/foods/${updatedFood._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "Food updated successfully") {
        alert("Food updated successfully!");
        fetchCategoriesWithFoods();
        setEditingFood(null);
        setImagePreview(null);
      } else {
        alert("Failed to update food.");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      alert("An error occurred while updating the food.");
    }
  };

  const handleDelete = async (foodId: string) => {
    try {
      await axios.delete(`http://localhost:3030/foods/${foodId}`);
      fetchCategoriesWithFoods();
      setSelectedFood(null);
      setDropdown(null);
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-gray-100 max-w-[900px] w-[100%] m-auto rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Foods by Category</h2>
      {categoriesWithFoods.length > 0 ? (
        categoriesWithFoods.map((category) => (
          <div key={category._id} className="my-2 py-2">
            <h3 className="text-lg font-semibold">{category.categoryName}</h3>
            <div className="flex justify-between items-center">
              <div className="border-2 border-dashed border-red-500 w-1/4 h-75 rounded-xl flex flex-col justify-center items-center text-gray-400 text-center">
                <button
                  onClick={() => {
                    setSelectedCategory(category._id);
                    toggleModal();
                  }}
                  className="bg-red-500 w-10 h-10 rounded-full text-white"
                >
                  +
                </button>
                <p> Add new dishes and appetizers</p>

                {showAddFoodModal && (
                  <AddFoodModal
                    selectedCategory={selectedCategory}
                    onClose={toggleModal}
                    onAddFood={handleAddFood}
                  />
                )}
              </div>
              <ul className="grid grid-cols-3 w-3/4 gap-2">
                {category.foods?.map((food) => (
                  <div
                    key={food._id}
                    className="relative border border-gray-200 p-2 rounded-3xl bg-white"
                  >
                    {food.image && (
                      <img
                        src={food.image}
                        alt={food.foodName}
                        className="h-40 w-60 px-2 rounded-3xl"
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <button
                        className="bg-white w-10 h-10 flex items-center justify-center rounded-full absolute bottom-[53%] right-[12%]"
                        onClick={() =>
                          setDropdown(dropdown === food._id ? null : food._id)
                        }
                      >
                        <PenIcon className="text-red-500 w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex justify-between py-2">
                      <li className="text-red-500 font-bold px-2">
                        {food.foodName}
                      </li>
                      <li className="px-2">{food.price}₮</li>
                    </div>
                    <li className="text-[12px] px-2 pb-2 h-10 overflow-hidden hover:h-full">
                      {food.ingredients}
                    </li>

                    {dropdown === food._id && (
                      <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-2 w-40">
                        <button
                          className="block px-3 py-1 text-blue-500 w-full text-left"
                          onClick={() => handleEdit(food)}
                        >
                          Edit
                        </button>

                        {editingFood && (
                          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center gap-2 w-full z-100">
                            <div className="bg-white p-6 rounded-lg w-[90%] md:w-[60%] lg:w-[40%]">
                              <h3 className="text-lg font-semibold">
                                Edit Food
                              </h3>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSave(editingFood);
                                }}
                              >
                                <div className="flex gap-2 justify-between">
                                  <input
                                    type="text"
                                    value={editingFood.foodName}
                                    onChange={(e) =>
                                      setEditingFood({
                                        ...editingFood,
                                        foodName: e.target.value,
                                      })
                                    }
                                    className="border p-2 w-full mb-2"
                                  />
                                  <input
                                    type="number"
                                    value={editingFood.price}
                                    onChange={(e) =>
                                      setEditingFood({
                                        ...editingFood,
                                        price: parseFloat(e.target.value),
                                      })
                                    }
                                    className="border p-2 w-full mb-2"
                                  />
                                </div>
                                <textarea
                                  value={editingFood.ingredients}
                                  onChange={(e) =>
                                    setEditingFood({
                                      ...editingFood,
                                      ingredients: e.target.value,
                                    })
                                  }
                                  className="border p-2 w-full mb-2"
                                />

                                {/* Image preview or upload */}
                                {imagePreview && (
                                  <div className="mt-4 flex justify-center border">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="w-50 object-cover rounded"
                                    />
                                  </div>
                                )}
                                <input
                                  type="file"
                                  name="image"
                                  onChange={handleImageChange}
                                  placeholder="Food Image"
                                  className="border p-2  px-20 rounded mb-4"
                                />
                                <div className="flex justify-center">
                                  <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingFood(null)}
                                    className="bg-gray-500 text-white p-2 ml-2"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}

                        <button
                          className="block px-3 py-1 text-red-500 w-full text-left"
                          onClick={() => handleDelete(food._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>Loading categories and foods...</p>
      )}
    </div>
  );
}
