
import React from "react";
import ProductForm from "@/components/ProductForm";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AddProduct() {

    const cookieStore = cookies();
    const auth = cookieStore.get("AUTH");
    if (!auth) {
        redirect("/login")
    }

    return (
        <ProductForm />
    )
}
