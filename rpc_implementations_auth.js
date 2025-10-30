// rpc_implementations_auth.js
const axios = require("axios");
require("dotenv").config();

// Create axios instance pointing to your Rails backend
const api = axios.create({
  baseURL: process.env.RAILS_BASE_URL || "http://localhost:3000",
  timeout: 10000,
});

module.exports = [
  // ---- Signup ----
  {
    name: "signup",
    arguments: {
      email: { type: "string", required: true },
      password: { type: "string", required: true },
      name: { type: "string" },
    },
    implementation: async (args) => {
      try {
        const res = await api.post("/signup", {
          user: {
            email: args.email,
            password: args.password,
            name: args.name,
          },
        });
        return res.data; // expected { user: {...}, token: "..." }
      } catch (err) {
        // Handle error gracefully
        return {
          success: false,
          status: "error",
          message: err.response?.data?.error || err.message,
        };
      }
    },
  },

  // ---- Login ----
  {
    name: "login",
    arguments: {
      password: { type: "string", required: true },
      username: { type: "string" },
    },
    implementation: async (args) => {
      try {
        const res = await api.post("/login", {
          user: {
            password: args.password,    
            username: args.username,
          },
        });
        return res.data; // expected { user: {...}, token: "..." }
      } catch (err) {
        return {
          success: false,
          status: "error",
          message: err.response?.data?.error || err.message,
        };
      }
    },
  },
];
