type Category = {
    _id?: string;
    categoryName: string;
    foodCount?: number; // 
};

type Food = {
    _id?: string;
    foodName: string;
    price: number;
    image: string;
    ingredients: string;
    categoryId: string;
};


type SetCategoryFn = (id: string) => void;