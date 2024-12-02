import ProductCard from "@/components/ProductCard";
import { getRequest } from "@/utilities/http.service";

type Product = {
    productId: number;
    externalProductId: string;
    name: string;
    category: string;
    description: string;
    price: number;
};

export default async function ProductList() {
    const response = await getRequest({ url: "/products?page=1&limit=10" });
    const products = response?.data?.data;

    return (
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product, index) => (
                <div
                    key={product?.externalProductId}
                >
                    <ProductCard
                        product={product}
                    />
                </div>
            ))}
        </div>
    );
}

