"use client";
import { useState } from 'react';
import axios from 'axios';

export default function AddFoodModal({ selectedCategory, onClose }: {
    selectedCategory: string | null,
    onClose: () => void
}) {
    const [newFood, setNewFood] = useState({ foodName: '', price: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmitFood = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCategory) return alert("Please select a category first!");
        setLoading(true);

        try {
            await axios.post('http://localhost:4040/food', {
                ...newFood,
                categoryId: selectedCategory
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setNewFood({ foodName: '', price: '' });
            onClose();
        } catch (error) {
            console.error('Error adding food:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Add Food</h2>
                <form onSubmit={handleSubmitFood} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="foodName"
                        value={newFood.foodName}
                        onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
                        placeholder="Food Name"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={newFood.price}
                        onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                        placeholder="Price"
                        className="border p-2 rounded"
                        required
                    />

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
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
