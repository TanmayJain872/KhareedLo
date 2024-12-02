/* jshint esversion: 11 */

import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getAuth = () => {
    const auth = cookies.get("AUTH");
    return auth;
};

export const setAuth = (data) => {
    cookies.set("AUTH", JSON.stringify(data), { path: "/", maxAge: 604800 });
    return data;
};

export const removeAuth = () => {
    cookies.remove("AUTH", { path: "/" });
    return;
};