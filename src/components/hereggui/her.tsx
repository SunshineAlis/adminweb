import React, { useState, useEffect } from "react";
import axios from "axios";
import { Category } from "../_components/Category";
import AddCategoryModal  from "../_components/AddCategoryModal";

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

const Categories: React.FC<CategoryProps> = ({
  categories: initialCategories,
  foodCountByCategory,
  setSelectedCategory,
  openAddFoodModal,
  handleDelete,
}) => {
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [category, setCategory] = useState<{ categoryName: string }>({
    categoryName: "",
  });
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown-container")) {
        setDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3030/category");
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:3030/category/${editingCategory._id}`,
          {
            categoryName: category.categoryName,
          }
        );
      } else {
        await axios.post(
          "http://localhost:3030/category",
          { categoryName: category.categoryName },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      setCategory({ categoryName: "" });
      setShowModal(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error("Error uploading category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 max-w-[850px] w-full m-auto rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Dishes Category</h3>
      <div className="flex flex-wrap gap-3 items-center">
        {categories.map((cat) => (
          <div key={cat._id} className="relative dropdown-container">
            <Category />

            {/* {dropdown === cat._id && ( */}
            {/* <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
                <button
                  className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setEditingCategory(cat);
                    setCategory({ categoryName: cat.categoryName });
                    setShowModal(true);
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
                )} */}
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
          // )}
          // </div>
        ))}
        <button
          onClick={() => {
            setEditingCategory(null);
            setCategory({ categoryName: "" });
            setShowModal(true);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-full text-lg"
        >
          +
        </button>
      </div>

      {/* Category Edit / Add Modal */}
      {showModal && <AddCategoryModal />}
    </div>
  );
};

export default Categories;
