import { useState } from "react";
import axios from "axios";

type AddFoodModalProps = {
  selectedCategory: string | null;
  onClose: () => void;
  onAddFood: (newFood: Food) => void;
  setSuccessMessage: (msg: string) => void;
};

export default function AddFoodModal({
  selectedCategory,
  onClose,
  onAddFood,
  setSuccessMessage,
}: AddFoodModalProps) {
  const [newFood, setNewFood] = useState({
    foodName: "",
    price: "",
    ingredients: "",
    image: null as File | null,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmitFood = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCategory) return alert("Please select a category first!");
    if (!newFood.image) return alert("Please select an image!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("foodName", newFood.foodName);
      formData.append("price", newFood.price);
      formData.append("ingredients", newFood.ingredients);
      formData.append("categoryId", selectedCategory);
      formData.append("image", newFood.image);

      const response = await axios.post(
        "http://localhost:3030/foods",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (onAddFood) {
        onAddFood(response.data.food);
      }
      setNewFood({
        foodName: "",
        price: "",
        ingredients: "",
        image: null,
        imageUrl: "",
      });
      setSuccessMessage(response.data.message);

      onClose();
    } catch (error) {
      console.error("Error adding food:", error);
      setSuccessMessage("error adding food");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFood({
        ...newFood,
        image: file,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[440px]">
        <h2 className="text-xl font-semibold mb-4">Add Food</h2>
        <form onSubmit={handleSubmitFood} className="flex flex-col gap-2">
          <div className="flex gap-2 justify-between">
            <input
              type="text"
              name="foodName"
              value={newFood.foodName}
              onChange={(e) =>
                setNewFood({ ...newFood, foodName: e.target.value })
              }
              placeholder="Food Name"
              className="border p-2 w-50 rounded"
              required
            />
            <input
              type="number"
              name="price"
              value={newFood.price}
              onChange={(e) =>
                setNewFood({ ...newFood, price: e.target.value })
              }
              placeholder="Food Price"
              className="border p-2 w-44 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="ingredients"
            value={newFood.ingredients}
            onChange={(e) =>
              setNewFood({ ...newFood, ingredients: e.target.value })
            }
            placeholder="Ingredients"
            className="border p-2 rounded"
            required
          />

          {newFood.imageUrl ? (
            <div className="mt-4 flex justify-center border">
              <img
                src={newFood.imageUrl}
                alt="Preview"
                className="w-[90%] object-cover rounded"
              />
            </div>
          ) : (
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="border p-2 rounded"
              required
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
