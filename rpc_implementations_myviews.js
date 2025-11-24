// rpc_implementations_myviews.js
const axios = require("axios");
require("dotenv").config();

const api = axios.create({
  baseURL: process.env.RAILS_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

function authHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

module.exports = [
  // GET /my/created
  {
    name: "getMyCreated",
    arguments: { token: { type: "string", required: true } },
    implementation: async (args) => {
      try {
        const res = await api.get("/my/created", authHeader(args.token));
        return { success: true, tickets: res.data };
      } catch (err) {
        console.error("getMyCreated error:", err.response?.data || err.message);
        return { success: false, message: err.response?.data?.error || err.message, details: err.response?.data };
      }
    },
  },

  // GET /my/assigned
  {
    name: "getMyAssigned",
    arguments: { token: { type: "string", required: true } },
    implementation: async (args) => {
      try {
        const res = await api.get("/my/assigned", authHeader(args.token));
        return { success: true, tickets: res.data };
      } catch (err) {
        console.error("getMyAssigned error:", err.response?.data || err.message);
        return { success: false, message: err.response?.data?.error || err.message, details: err.response?.data };
      }
    },
  },
];
