const mode = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.MODE
    ? import.meta.env.MODE
    : "development";

const API_BASE_URL =
    mode === "production"
        ? "https://kapee-ecommerce-backend.onrender.com"
        : "http://localhost:8080";

export default API_BASE_URL;