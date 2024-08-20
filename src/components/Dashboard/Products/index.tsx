import { getProducts } from "@/data-access/products";
import { ProductsList } from "./ProductsList";
import { productsColumns } from "./columns";

const Products = async () => {
  const products = await getProducts();

  return (
    <div>
      <ProductsList columns={productsColumns} data={products} />
    </div>
  );
};
export default Products;
