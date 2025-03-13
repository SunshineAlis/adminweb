"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";



export default function FoodsByCategory() {
    const [categoriesWithFoods, setCategoriesWithFoods] = useState<Category[]>([]);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [dropdown, setDropdown] = useState<string | null>(null);

    const fetchCategoriesWithFoods = async () => {
        try {
            const categoryResponse = await axios.get("http://localhost:3030/category");
            const categories = categoryResponse.data.data;

            const categoriesData = await Promise.all(
                categories.map(async (category: Category) => {
                    try {
                        const foodResponse = await axios.get<{ foods: Food[] }>(
                            `http://localhost:3030/foods/${category._id}/foods`
                        );
                        return { ...category, foods: foodResponse.data.foods || [] };
                    } catch (error) {
                        console.error(`Error fetching foods for category ${category._id}:`, error);
                        return { ...category, foods: [] };
                    }
                })
            );
            setCategoriesWithFoods(categoriesData);
        } catch (error) {
            console.error("Error fetching categories with foods:", error);
        }
    };

    useEffect(() => {
        fetchCategoriesWithFoods();
    }, []);

    const handleFoodClick = (food: Food) => {
        setSelectedFood(food);
        setDropdown(null); // 
    };

    const handleEdit = (food: Food) => {
        setEditingFood(food);
    };

    const handleSave = async (updatedFood: Food) => {
        try {
            await axios.put(`http://localhost:3030/foods/${updatedFood._id}`, updatedFood);
            fetchCategoriesWithFoods(); // Update the list
            setEditingFood(null);
        } catch (error) {
            console.error("Error updating food:", error);
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

    return (
        <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Foods by Category</h2>

            {categoriesWithFoods.length > 0 ? (
                categoriesWithFoods.map((category) => (
                    <div key={category._id} className="mb-6">
                        <h3 className="text-lg font-semibold">{category.categoryName}</h3>
                        <ul className="grid grid-cols-3 gap-2">
                            {category.foods && category.foods.length > 0 ? (
                                category.foods.map((food) => (
                                    <div
                                        key={food._id}
                                        className={`relative border border-gray-200 p-2 rounded-3xl bg-white cursor-pointer ${selectedFood?._id === food._id ? "bg-gray-100" : ""
                                            }`}
                                        onClick={() => handleFoodClick(food)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setDropdown(dropdown === food._id ? null : food._id);
                                        }}
                                    >
                                        {food.image && <img src={food.image} alt={food.foodName} className="h-auto rounded-3xl" />}
                                        <div className="flex justify-between">
                                            <li className="text-red-500 font-bold w-[75%]">{food.foodName}</li>
                                            <li>{food.price}</li>
                                        </div>
                                        <li>{food.ingredients}</li>

                                        {/* Dropdown цэс */}
                                        {dropdown === food._id && (
                                            <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg p-2 w-40 z-10">
                                                <button
                                                    className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => handleEdit(food)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => handleDelete(food._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No foods available</p>
                            )}
                        </ul>
                    </div>
                ))
            ) : (
                <p>Loading categories and foods...</p>
            )}
            <button
                onClick={() => {
                    setEditingFood(null);
                    setCategoriesWithFoods(categoriesData);
                    setShowModal(true);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-lg"
            >
                +
            </button>
            {/* Edit modal */}
            {editingFood && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Edit Food</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave(editingFood);
                            }}
                        >
                            <input
                                type="text"
                                value={editingFood.foodName}
                                onChange={(e) =>
                                    setEditingFood({ ...editingFood, foodName: e.target.value })
                                }
                                className="border p-2 w-full mb-2"
                            />
                            <input
                                type="number"
                                value={editingFood.price}
                                onChange={(e) =>
                                    setEditingFood({ ...editingFood, price: parseFloat(e.target.value) })
                                }
                                className="border p-2 w-full mb-2"
                            />
                            <textarea
                                value={editingFood.ingredients}
                                onChange={(e) =>
                                    setEditingFood({ ...editingFood, ingredients: e.target.value })
                                }
                                className="border p-2 w-full mb-2"
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2">
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingFood(null)}
                                className="bg-gray-500 text-white p-2 ml-2"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
} 