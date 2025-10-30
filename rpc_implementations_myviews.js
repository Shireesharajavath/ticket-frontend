// rpc_implementations_myviews.js
const axios = require("axios");
require("dotenv").config();

const api = axios.create({
  baseURL: process.env.RAILS_BASE_URL,
  timeout: 10000,
});

module.exports = [
  {
    name: "getMyCreated",
    arguments: { token: { type: "string", required: true } },
    implementation: async (args) => {
      const res = await api.get("/my/created", { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "getMyAssigned",
    arguments: { token: { type: "string", required: true } },
    implementation: async (args) => {
      const res = await api.get("/my/assigned", { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },
];
