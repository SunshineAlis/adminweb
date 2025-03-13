import { useState } from "react";

type CategoryProps = {
  category: Category;
  foodCountByCategory: { [key: string]: number };
  setSelectedCategory: (id: string) => void;
  openAddFoodModal: (catId: string) => void;
  handleDelete?: (id: string) => void;
};

type Category = {
  _id: string;
  categoryName: string;
};

export const Category = ({
  category,
  foodCountByCategory,
  setSelectedCategory,
  openAddFoodModal,
  handleDelete,
}: CategoryProps) => {
  const [dropdown, setDropdown] = useState<string | null>(null);

  return (
    <div className="relative">
      <span
        onClick={() => {
          setSelectedCategory(category._id);
          setDropdown(dropdown === category._id ? null : category._id);
        }}
        className="px-3 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition"
      >
        {category.categoryName} ({foodCountByCategory[category._id] ?? 0})
      </span>

      {dropdown === category._id && (
        <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
          <button
            className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
            onClick={() => openAddFoodModal(category._id)}
          >
            Add Food
          </button>
          {handleDelete && (
            <button
              className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
              onClick={() => handleDelete(category._id)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
