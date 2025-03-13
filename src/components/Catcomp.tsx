import React, { useState, useEffect } from "react";

interface Category {
    _id: string;
    categoryName: string;
}

type CategoryProps = {
    categories: Category[];
    foodCountByCategory: { [key: string]: number };
    setSelectedCategory: (id: string) => void;
    openAddFoodModal: (catId: string) => void;
    handleDelete?: (id: string) => void;
};

const CategoryComponent: React.FC<CategoryProps> = ({
    categories,
    foodCountByCategory,
    setSelectedCategory,
    openAddFoodModal,
    handleDelete,
}) => {
    const [dropdown, setDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest('.dropdown-container')) {
                setDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="p-4 bg-gray-100 max-w-[850px] w-full m-auto rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Dishes Category</h3>
            <div className="flex flex-wrap gap-3 items-center">
                {categories.map((cat) => (
                    <div key={cat._id} className="relative dropdown-container">
                        <span
                            onClick={() => {
                                setSelectedCategory(cat._id);
                                setDropdown(dropdown === cat._id ? null : cat._id);
                            }}
                            className="px-3 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition"
                        >
                            {cat.categoryName} ({foodCountByCategory[cat._id] ?? 0})
                        </span>

                        {dropdown === cat._id && (
                            <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
                                <button
                                    className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                        // Энд та edit функц дуудаж болно.
                                        // Жишээ нь: openEditModal(cat) гэх мэт.
                                        setDropdown(null);
                                    }}
                                >
                                    Edit
                                </button>
                                {handleDelete && (
                                    <button
                                        className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
                                        onClick={() => {
                                            handleDelete(cat._id);
                                            setDropdown(null);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    className="block px-3 py-1 text-green-500 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                        setSelectedCategory(cat._id);
                                        openAddFoodModal(cat._id);
                                        setDropdown(null);
                                    }}
                                >
                                    Add Food
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryComponent;
