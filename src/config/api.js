// src/config/api.js
const API_URL = "https://api.cybercodeedulabs.com";
if(!API_URL){
    console.warn("[CONFIG WARNING] VITE_API_URL is not defined. API calls will fail");
}
export default API_URL;
