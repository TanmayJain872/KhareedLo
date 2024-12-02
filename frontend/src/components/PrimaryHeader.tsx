"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getAuth, removeAuth } from "@/utilities/cookie.service";

const PrimaryHeader = ({ ...props }) => {
    const router = useRouter();
    const auth = getAuth();

    return (
        <header className="flex flex-row items-center justify-between px-4 bg-gray-800 h-12 md:h-14">
            <h1
                className="text-2xl text-white font-serif"
                onClick={() => router.push("/products")}
            >
                KhareedLo
            </h1>
            {auth?.username?.length ?
                <div className="flex flex-row gap-2 md:gap-6 w-fit">
                    <button
                        className="bg-blue-500 text-white w-28 h-8 rounded-md"
                        onClick={() => router.push("/products/new")}
                    >
                        Add Product
                    </button>
                    <button
                        className="bg-blue-500 text-white w-16 h-8 rounded-md"
                        onClick={() => {
                            removeAuth();
                            router.push("/login");
                            router.refresh();
                        }}
                    >
                        Logout
                    </button>
                </div>
                    :
                <button
                    className="bg-blue-500 text-white w-16 h-8 rounded-md"
                    onClick={() => router.push("/login")}
                >
                    Login
                </button>
            }
        </header>
    )
}

export default PrimaryHeader