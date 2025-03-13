


type Category = {
    _id?: string;
    categoryName: string;
    foodCount?: number;
    foods?: Food[]
    _id: string;
    categoryName: string;
};
type CategoryId = {
    _id: string;
    name: string;

}
type CategoryWithExtra = {
    _id: string;
    name: string;
    description: string;

}

type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    categoryId: string;
    image: file
    _id?: string;
    image?: string;
};

type SetCategoryFn = (id: string) => void;
type Category = CategoryId | CategoryWithExtra;