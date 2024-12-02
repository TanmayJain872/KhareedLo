/* jshint esversion: 11 */

"use client";

import { useEffect, useState, useReducer, useRef } from "react";
import { productCategoryOptions } from "@/constants/ProductConstants";
import { postRequest, putRequest } from "@/utilities/http.service";
import { useRouter } from "next/navigation";
import { getAuth } from "@/utilities/cookie.service";


interface FormStateProps {
    name: string;
    category: string;
    description: string;
    price: number;
}

interface FormActionsProps {
    field: string;
    value: string;
}

const ProductForm = ({ product }: {
    product: {
        name: string,
        category: string,
        description: string,
        price: string,
        productId: number
    }
}) => {

    const initialState = {
        name: product?.name ?? "",
        category: product?.category ?? "",
        description: product?.description ?? "",
        price: product?.price ?? "",
    };

    const productReducer = (
        currentState: FormStateProps = {
            name: "",
            category: "",
            description: "",
            price: 0
        },
        action: FormActionsProps = {
            field: "",
            value: ""
        }
    ) => {
        switch (action?.field) {
            case "name":
                return {
                    ...currentState,
                    name: action?.value,
                };
            case "category":
                return {
                    ...currentState,
                    category: action?.value,
                };
            case "description":
                return {
                    ...currentState,
                    description: action?.value,
                };
            case "price":
                return {
                    ...currentState,
                    price: action?.value,
                };
            default:
                return currentState;
        }
    };

    const [productDetails, dispatch] = useReducer(productReducer, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const nameRef = useRef();
    const auth = getAuth();


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        if (product) {
            // update product API
            const response = await putRequest({
                url: `/products/${product?.productId}`,
                data: { ...productDetails, updatedBy: auth?.userId },
                withAuth: true
            });
            if (response?.error) {
                alert(response?.message);
                return;
            }
            alert(response?.message);
            router.push("/products");
        } else {
            // create product API
            const response = await postRequest({
                url: `/products`,
                data: { ...productDetails, createdBy: auth?.userId },
                withAuth: true
            });
            if (response?.error) {
                alert(response?.message);
                return;
            }
            alert(response?.message)
            router.push("/products");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (!product) nameRef.current.focus();
    }, [])

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-black">
            <h1 className="text-2xl mb-6">{product ? "Edit Product" : "Create Product"}</h1>
            <form
                className="bg-white p-6 rounded-2xl shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
                onSubmit={handleSubmit}
            >

                <div className="mb-4">
                    <input
                        id="name"
                        type="text"
                        className="w-full p-2 border rounded"
                        defaultValue={productDetails?.name}
                        placeholder="Name"
                        ref={nameRef}
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "name", value: e.target.value?.trim() });
                        }}
                        required
                    />
                </div>

                <div className="mb-4">
                    <select
                        id="category"
                        className="w-full p-2 border rounded"
                        defaultValue={productDetails?.category}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch({ field: "category", value: e.target.value })
                        }}
                        required
                    >
                        <option className="text-gray-200" value="" disabled>Select Category</option>
                        {productCategoryOptions.map(option => {
                            return (
                                <option key={option?.id} value={option?.name}>
                                    {option?.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="mb-4">
                    <textarea
                        id="description"
                        className="w-full p-2 border rounded"
                        defaultValue={productDetails?.description}
                        placeholder="Description"
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "description", value: e.target.value?.trim() });
                        }}
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        id="price"
                        type="number"
                        className="w-full p-2 border rounded"
                        defaultValue={productDetails?.price}
                        placeholder="Price"
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "price", value: e.target.value });
                        }}
                        min="0"
                        step="0.5"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded mb-4"
                    disabled={isLoading}
                >
                    {isLoading ? "Submitting..." : product ? "Update" : "Add"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
