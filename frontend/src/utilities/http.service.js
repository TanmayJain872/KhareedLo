/* jshint esversion: 11 */

import axios from "axios";
import { getAuth } from "./cookie.service";

const baseUrl = "http://localhost:5000/api";
const headers = {
    "Content-Type": "application/json",
    "X-platform": "web",
};


export const postRequest = async ({ url, data, withAuth = false }) => {
    try {
        if (withAuth) {
            const auth = getAuth();
            headers["Authorization"] = auth?.token;
        }
        const response = await axios.post(
            `${baseUrl}${url}`,
            data,
            {
                headers,
                "withCredentials": withAuth,
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error in Storing data", error);
        return error?.response?.data;
    }
};

export const putRequest = async ({ url, data, withAuth = false }) => {
    try {
        if (withAuth) {
            const auth = getAuth();
            headers["Authorization"] = auth?.token;
        }
        const response = await axios.put(
            `${baseUrl}${url}`,
            data,
            {
                headers,
                "withCredentials": withAuth,
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error in Updating data", error);
        return error?.response?.data;
    }
};

export const getRequest = async ({ url, withAuth = false }) => {
    try {
        if (withAuth) {
            const auth = getAuth();
            headers["Authorization"] = auth?.token;
        }
        const response = await axios.get(
            `${baseUrl}${url}`,
            {
                headers,
                "withCredentials": withAuth,
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error in Fetching data", error);
        return error?.response?.data;
    }
};

export const deleteRequest = async ({ url, withAuth = false }) => {
    try {
        if (withAuth) {
            const auth = getAuth();
            headers["Authorization"] = auth?.token;
        }
        const response = await axios.delete(
            `${baseUrl}${url}`,
            {
                headers,
                "withCredentials": withAuth,
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error in Deleting data", error);
        return error?.response?.data;
    }
};
