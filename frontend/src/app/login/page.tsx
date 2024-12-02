"use client";

import { useState, useEffect, useRef } from "react";
import { postRequest } from "@/utilities/http.service";
import { getAuth, setAuth } from "@/utilities/cookie.service";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Login = ({ ...props }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const auth = getAuth();
    const usernameRef = useRef();
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await postRequest({
            url: `/auth/login`,
            data: {
                username,
                password,
            },
        });
        if (response?.error) {
            alert(response?.message);
            return;
        }
        setAuth(response?.data);
        router.push("/products");
        router.refresh();
    };

    useEffect(() => {
        if (auth) {
            router.replace("/products")
        }
        usernameRef.current.focus();
    }, [])

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
            <form className="bg-white p-6 rounded-2xl shadow-lg w-5/6 sm:w-3/4 md:w-1/2 lg:w-1/4" onSubmit={handleSubmit}>
                <h2 className="text-xl mb-4">Login</h2>
                <div className="mb-4">
                    <input
                        id="username"
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Username"
                        ref={usernameRef}
                        onBlur={(e) => {
                            e.preventDefault();
                            setUsername(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        id="password"
                        type="password"
                        className="w-full p-2 border rounded"
                        placeholder="Password"
                        onBlur={(e) => {
                            e.preventDefault();
                            setPassword(e.target.value);
                        }}
                        required
                    />
                </div>
                <button type="submit" className="w-full mb-4 bg-green-500 text-white p-2 rounded">
                    Login
                </button>
                <hr className="w-full bg-gray-500"/>
                <Link href="/register">
                    <button
                        className="w-full mb-4 bg-blue-500 text-white p-2 rounded"
                        type="button"
                    >
                        Register
                    </button>
                </Link>
            </form>
        </div>
    );
};

export default Login;
