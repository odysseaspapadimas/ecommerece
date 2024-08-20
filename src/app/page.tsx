import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getProducts } from "@/data-access/products";
import Image from "next/image";

export default async function Home() {

  const products = await getProducts();

  return (
    <MaxWidthWrapper>
     
    </MaxWidthWrapper>
  );
}
