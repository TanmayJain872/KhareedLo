"use client";

import { useState, useReducer, useEffect, useRef } from 'react';

import { postRequest } from '@/utilities/http.service';
import { getAuth, setAuth } from '@/utilities/cookie.service';
import { useRouter } from 'next/navigation';


interface FormStateProps {
    fullName: string;
    username: string;
    password: string;
    emailId: string;
}

interface FormActionsProps {
    field: string;
    value: string;
}

const Register = () => {
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const auth = getAuth();
    const fullNameRef = useRef();

    const initialState = {
        fullName: "",
        username: "",
        password: "",
        emailId: "",
    };

    const userReducer = (
        currentState: FormStateProps = {
            fullName: "",
            username: "",
            password: "",
            emailId: ""
        },
        action: FormActionsProps = {
            field: "",
            value: ""
        }
    ) => {
        switch (action?.field) {
            case "fullName":
                return {
                    ...currentState,
                    fullName: action?.value,
                };
            case "username":
                return {
                    ...currentState,
                    username: action?.value,
                };
            case "password":
                return {
                    ...currentState,
                    password: action?.value,
                };
            case "emailId":
                return {
                    ...currentState,
                    emailId: action?.value,
                };
            default:
                return currentState;
        }
    };

    const [userDetails, dispatch] = useReducer(userReducer, initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userDetails?.password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const response = await postRequest({
            url: `/auth/register`,
            data: {
                ...userDetails,
            }
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
        fullNameRef.current.focus();
    }, [])

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
            <form className="bg-white p-6 rounded-2xl mb-32 shadow-lg w-5/6 sm:w-3/4 md:w-1/2 lg:w-1/3" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        id="fullName"
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Full Name"
                        defaultValue={userDetails?.fullName}
                        ref={fullNameRef}
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "fullName", value: e.target.value.trim() });
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        id="emailId"
                        type="email"
                        className="w-full p-2 border rounded"
                        placeholder="Email ID"
                        defaultValue={userDetails?.emailId}
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "emailId", value: e.target.value.trim() });
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        id="username"
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Username"
                        defaultValue={userDetails?.username}
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "username", value: e.target.value.trim() });
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        defaultValue={userDetails?.password}
                        onBlur={(e) => {
                            e.preventDefault();
                            dispatch({ field: "password", value: e.target.value.trim() });
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-2 border rounded"
                        defaultValue={confirmPassword}
                        onBlur={(e) => {
                            e.preventDefault();
                            setConfirmPassword(e.target.value.trim());
                        }}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
