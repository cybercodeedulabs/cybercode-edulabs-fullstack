// src/config/api.js
const API_URL = import.meta.env.VITE_API_URL;
if(!API_URL){
    console.warn("[CONFIG WARNING] VITE_API_URL is not defined. API calls will fail");
}
export default API_URL;
