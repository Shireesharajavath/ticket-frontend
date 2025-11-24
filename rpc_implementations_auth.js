// rpc_implementations_auth.js
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

  // ----------------------------------------------
  // SIGNUP (POST /signup)
  // ----------------------------------------------
  {
    name: "signup",
    arguments: {
      email: { type: "string", required: true },
      password: { type: "string", required: true },
      password_confirmation: { type: "string", required: true },
    },

    implementation: async (args) => {
      try {
        if (args.password !== args.password_confirmation) {
          return { success: false, message: "Passwords do not match" };
        }

        const res = await api.post("/signup", {
          user: {
            email: args.email,
            password: args.password,
            password_confirmation: args.password_confirmation,
          },
        });

        return {
          success: true,
          message: "User created",
          user: res.data.user || res.data,
        };

      } catch (err) {
        console.error("signup error:", err.response?.data || err.message);
        return {
          success: false,
          message:
            err.response?.data?.errors?.join?.(", ") ||
            err.response?.data?.error ||
            err.message,
          details: err.response?.data
        };
      }
    },
  },
{
  name: "login",
  arguments: {
    email: { type: "string", required: true },
    password: { type: "string", required: true },
  },

  implementation: async (args) => {
    try {
      const res = await api.post("/login", {
        email: args.email,
        password: args.password,
      });

      return {
        success: true,
        message: res.data.message,
        token: res.data.token,
        user_id: res.data.user_id,
        email: res.data.email
      };

    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.error ||
          "Invalid email or password",
      };
    }
  },
},

  // ----------------------------------------------
  // LOGOUT (DELETE /logout)
  // ----------------------------------------------
  {
    name: "logout",
    arguments: {
      token: { type: "string", required: true },
    },

    implementation: async (args) => {
      try {
        const res = await api.delete("/logout", authHeader(args.token));

        return {
          success: true,
          message: res.data.message || "Logged out",
        };

      } catch (err) {
        console.error("logout error:", err.response?.data || err.message);

        return {
          success: false,
          message: err.response?.data?.error || err.message,
          details: err.response?.data,
        };
      }
    },
  },

  // ----------------------------------------------
  // GET CURRENT USER (GET /current_user)
  // ----------------------------------------------
  {
    name: "getCurrentUser",
    arguments: {
      token: { type: "string", required: true },
    },

    implementation: async (args) => {
      try {
        const res = await api.get("/current_user", {
          headers: { Authorization: `Bearer ${args.token}` },
        });

        return {
          success: true,
          user: res.data, // contains { id, email }
        };

      } catch (err) {
        console.error("getCurrentUser error:", err.response?.data || err.message);

        return {
          success: false,
          message:
            err.response?.data?.error ||
            err.message,
          details: err.response?.data,
        };
      }
    },
  },

];
