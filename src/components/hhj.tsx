'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Category({ setSelectedCategory, openAddFoodModal }: {
    setSelectedCategory: (id: string) => void,
    openAddFoodModal: () => void
}) {
    const [category, setCategory] = useState<Category>({ categoryName: '' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [dropdown, setDropdown] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4040/category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <div className="p-4 bg-gray-100 max-w-[850px] w-[100%] m-auto rounded-lg">
            <h3 className="max-w-[800px] w-[100%] m-auto my-2 text-lg font-semibold">Dishes category</h3>
            <div className="max-w-[800px] w-[100%] m-auto flex flex-wrap gap-3 items-center">
                {categories.map((cat) => (
                    <div key={cat._id} className="relative dropdown-container">
                        <span
                            onClick={() => setDropdown(dropdown === cat._id! ? null : cat._id!)}
                            className={`px-3 py-1 rounded-lg cursor-pointer transition ${dropdown === cat._id ? 'bg-blue-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {cat.categoryName}
                        </span>

                        {dropdown === cat._id && (
                            <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
                                <button
                                    className="block px-3 py-1 text-green-500 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                        setSelectedCategory(cat._id!);
                                        openAddFoodModal();
                                        setDropdown(null);
                                    }}
                                >
                                    Add Food
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setCategory({ categoryName: '' });
                        setShowModal(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-full text-lg"
                >
                    +
                </button>
            </div>
        </div>
    );
}
