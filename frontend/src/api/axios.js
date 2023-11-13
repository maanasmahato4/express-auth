import axios from "axios";


const BASE_URL = "http://localhost:3000/api";

const publicApi = axios.create({
    baseURL: BASE_URL
});

const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export {publicApi, privateApi};