// 'use client';
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Category({ setSelectedCategory, openAddFoodModal }: {
//     setSelectedCategory: (id: string) => void,
//     openAddFoodModal: () => void
// }) {
//     const [category, setCategory] = useState<Category>({ categoryName: '' });
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//     const [dropdown, setDropdown] = useState<string | null>(null);
//     const [selectedCategory, setSelected] = useState<string | null>(null);

//     useEffect(() => {
//         fetchCategories();
//     }, []);


//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get('http://localhost:4040/category'); // category API руу хүсэлт
//             const categoriesWithFoodCount = await Promise.all(response.data.map(async (cat: any) => {
//                 // Хоолны тоог авах
//                 const foodResponse = await axios.get(`http://localhost:4040/category/${cat._id}/food`); // category ID ашиглан хоолны тоог авах
//                 return { ...cat, foodCount: foodResponse.data.length }; // Хоолны тоог category объектод нэмэх
//             }));
//             setCategories(categoriesWithFoodCount);
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     };


//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         setLoading(true);

//         try {
//             if (editingCategory) {
//                 await axios.put(`http://localhost:4040/category/${editingCategory._id}`, { categoryName: category.categoryName });
//             } else {
//                 await axios.post('http://localhost:4040/category', category, {
//                     headers: { 'Content-Type': 'application/json' },
//                 });
//             }
//             setCategory({ categoryName: '' });
//             setShowModal(false);
//             setEditingCategory(null);
//             fetchCategories();
//         } catch (error) {
//             console.error('Error uploading category:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id?: string) => {
//         if (!id) return;
//         if (!window.confirm("Are you sure you want to delete this category?")) return;

//         try {
//             await axios.delete(`http://localhost:4040/category/${id}`);
//             fetchCategories();
//             if (selectedCategory === id) setSelected(null);
//         } catch (error) {
//             console.error("Error deleting category:", error);
//         }
//     };

//     return (
//         <div className="p-4 bg-gray-100 max-w-[850px] w-[100%] m-auto rounded-lg">
//             <h3 className="max-w-[800px] w-[100%] m-auto my-2 text-lg font-semibold">Dishes category</h3>
//             <div className="max-w-[800px] w-[100%] m-auto flex flex-wrap gap-3 items-center">
//                 {categories.map((cat) => (
//                     <div key={cat._id} className="relative dropdown-container">
//                         <span
//                             onClick={() => setDropdown(dropdown === cat._id! ? null : cat._id!)}
//                             className={`px-3 py-1 rounded-lg cursor-pointer transition ${selectedCategory === cat._id ? 'bg-blue-300' : 'bg-gray-200 hover:bg-gray-300'}`}
//                         >
//                             {cat.categoryName} ({cat.foodCount || 0}) Хоолны тоог харуулах
//                         </span>

//                         {dropdown === cat._id && (
//                             <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
//                                 <button
//                                     className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
//                                     onClick={() => {
//                                         setEditingCategory(cat);
//                                         setCategory({ categoryName: cat.categoryName });
//                                         setShowModal(true);
//                                         setDropdown(null);
//                                     }}
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
//                                     onClick={() => handleDelete(cat._id)}
//                                 >
//                                     Delete
//                                 </button>
//                                 <button
//                                     className="block px-3 py-1 text-green-500 hover:bg-gray-100 w-full text-left"
//                                     onClick={() => {
//                                         setSelectedCategory(cat._id!);
//                                         openAddFoodModal();
//                                         setDropdown(null);
//                                     }}
//                                 >
//                                     Add Food
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 ))}

//                 <button
//                     onClick={() => {
//                         setEditingCategory(null);
//                         setCategory({ categoryName: '' });
//                         setShowModal(true);
//                     }}
//                     className="bg-red-500 text-white px-4 py-2 rounded-full text-lg"
//                 >
//                     +
//                 </button>
//             </div>

//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                         <h2 className="text-xl font-semibold mb-4">
//                             {editingCategory ? 'Edit Category' : 'Add Category'}
//                         </h2>

//                         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                             <input
//                                 type="text"
//                                 name="categoryName"
//                                 value={category.categoryName}
//                                 onChange={(e) => setCategory({ categoryName: e.target.value })}
//                                 placeholder="Category Name"
//                                 className="border p-2 rounded"
//                                 required
//                             />

//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     className="bg-gray-400 text-white px-4 py-2 rounded"
//                                     onClick={() => {
//                                         setShowModal(false);
//                                         setDropdown(null);
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//                                     disabled={loading}
//                                 >
//                                     {loading ? (editingCategory ? 'Updating...' : 'Adding...') : editingCategory ? 'Update' : 'Add'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
