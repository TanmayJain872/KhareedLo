"use client";

import { getAuth } from "@/utilities/cookie.service";
import { deleteRequest } from "@/utilities/http.service";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const { externalProductId, name, category, description, price, productId } = product;
  const router = useRouter();
  const auth = getAuth();

  const editProduct = () => {
    if (!auth) {
      alert("Please login to edit the product detail.")
      return;
    }
    router.push(`products/${externalProductId}/edit`);
  };

  const deleteProduct = async () => {
    if (!auth) {
      alert("Please login to remove the product.")
      return;
    }
    const response = await deleteRequest({
      url: `/products/${productId}`,
      withAuth: true
    });
    if (response?.error) {
      alert(response?.message);
      return;
    }
    alert(response?.message);
    router.refresh();
  };

  return (
    <div className="border bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">Category: {category}</p>
      <p className="text-gray-800">{description}</p>
      <p className="text-lg font-semibold">Price: ₹{price}</p>
      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={editProduct}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={deleteProduct}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
