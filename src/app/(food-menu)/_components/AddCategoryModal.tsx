import { useState } from "react";
import axios from "axios";

type Category = {
  _id: string;
  categoryName: string;
};

type CategoryProps = {
  categories: Category[];
  foodCountByCategory: { [key: string]: number };
  setSelectedCategory: (id: string) => void;
  openAddFoodModal: (catId: string) => void;
  handleDelete?: (id: string) => void;
};

const AddCategoryModal: React.FC<CategoryProps> = ({
  categories: initialCategories,
  foodCountByCategory,
  setSelectedCategory,
  openAddFoodModal,
  handleDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [category, setCategory] = useState<{ categoryName: string }>({
    categoryName: "",
  });
  const [categories, setCategories] = useState<Category[]>(initialCategories);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="categoryName"
            value={category.categoryName}
            onChange={(e) => setCategory({ categoryName: e.target.value })}
            placeholder="Category Name"
            className="border p-2 rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading
                ? editingCategory
                  ? "Updating..."
                  : "Adding..."
                : editingCategory
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
