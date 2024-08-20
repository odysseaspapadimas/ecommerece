import { getCategories } from "@/data-access/products";
import CreateProductForm from "./CreateProductForm";

const CreateProduct = async () => {
  const categories = await getCategories();

  return (
    <div className="w-full p-8 rounded-md border border-gray-300">
      <h1 className="">Create Product</h1>
      <p>Add a new product</p>

      <CreateProductForm categories={categories} />
    </div>
  );
};
export default CreateProduct;
