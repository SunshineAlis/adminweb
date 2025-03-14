"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoryComponent from "@/components/Category";
import AddFoodModal from "@/components/FoodCards"; // Өөрийн модаль компонентаа оруулна уу

interface Category {
    _id: string;
    categoryName: string;
}

interface Food {
    _id?: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string;
}

export default function Main() {
    const [categories, setCategories] = useState<Category[]>([]);
    // Категори ID-аар keyed байдлаар хоолны тоог хадгална
    const [foodCountByCategory, setFoodCountByCategory] = useState<{ [key: string]: number }>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAddFoodModal, setShowAddFoodModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Категори болон эхний хоолны тоог серверээс ачаалах
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
                                const foodResponse = await axios.get(`http://localhost:3030/foods/${cat._id}/foodCount`);
                                counts[cat._id] = foodResponse.data.count;
                            } catch (error) {
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

    // Модаль нээх үед сонгосон категори-г тодорхойлно
    const openAddFoodModal = (catId: string) => {
        setSelectedCategory(catId);
        setShowAddFoodModal(true);
    };

    // AddFoodModal-ээс хоол нэмэгдсэний дараа дуудна
    const handleAddFood = (newFood: Food) => {
        if (selectedCategory) {
            setFoodCountByCategory((prev) => ({
                ...prev,
                [selectedCategory]: (prev[selectedCategory] || 0) + 1,
            }));
            console.log("New food added in category:", selectedCategory, newFood);
        }
    };

    return (
        <div className="p-4">
            <CategoryComponent
                categories={categories}
                foodCountByCategory={foodCountByCategory}
                setSelectedCategory={setSelectedCategory}
                openAddFoodModal={openAddFoodModal}
            />

            {showAddFoodModal && (
                <AddFoodModal
                    selectedCategory={selectedCategory}
                    onClose={() => setShowAddFoodModal(false)}
                    onAddFood={handleAddFood}
                    setSuccessMessage={setSuccessMessage}
                />
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded fixed top-4 right-4">
                    {successMessage}
                </div>
            )}
        </div>
    );
}
