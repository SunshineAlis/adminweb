import React, { useState } from "react";
import axios from "axios";

interface Food {
    _id?: string;
    foodName: string;
    price: string;
    ingredients: string;
    image?: string;
}

interface AddFoodModalProps {
    selectedCategory: string | null;
    onClose: () => void;
    onAddFood?: (newFood: Food) => void;
    setSuccessMessage: (msg: string) => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
    selectedCategory,
    onClose,
    onAddFood,
    setSuccessMessage,
}) => {
    const [newFood, setNewFood] = useState<Food>({
        foodName: "",
        price: "",
        ingredients: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmitFood = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return alert("Please select a category first!");
        if (!image) return alert("Please select an image!");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("foodName", newFood.foodName);
            formData.append("price", newFood.price);
            formData.append("ingredients", newFood.ingredients);
            formData.append("categoryId", selectedCategory);
            formData.append("image", image);

            const response = await axios.post("http://localhost:3030/foods", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onAddFood(response.data.food); // Callback-аар state шинэчлэх
            setSuccessMessage(response.data.message);
            onClose();
        } catch (error) {
            console.error("Error adding food:", error);
            setSuccessMessage("Error adding food");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Add Food</h2>
                <form onSubmit={handleSubmitFood} className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Food Name"
                        value={newFood.foodName}
                        onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newFood.price}
                        onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Ingredients"
                        value={newFood.ingredients}
                        onChange={(e) => setNewFood({ ...newFood, ingredients: e.target.value })}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        required
                        className="border p-2 rounded"
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFoodModal;
