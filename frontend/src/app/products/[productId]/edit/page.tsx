import ProductForm from "@/components/ProductForm";
import { getRequest } from "@/utilities/http.service";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function EditProduct ({ params }: {
    params: {
        productId: string
    }
}) {
    const cookieStore = cookies();
    const auth = cookieStore.get("AUTH");
    if (!auth) {
        redirect("/login")
    }
    const response = await getRequest({ url: `/products/${params?.productId}` });
    const product = response?.data;

    return (
        <ProductForm product={product} />
    )
}
