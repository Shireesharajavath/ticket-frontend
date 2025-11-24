// rpc_implementations_comments.js
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
  // -------------------------
  // GET COMMENTS
  // -------------------------
  {
    name: "getComments",
    arguments: {
      token: { type: "string", required: true },
      ticket_id: { type: "number", required: true },
    },
    implementation: async (args) => {
      try {
        const res = await api.get(
          `/tickets/${args.ticket_id}/comments`,
          authHeader(args.token)
        );

        // Expecting backend returns { comments: [...] }
        return {
          success: true,
          comments: res.data.comments || res.data || [],
        };
      } catch (err) {
        console.error("getComments error:", err.response?.data || err.message);
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

  // -------------------------
  // CREATE COMMENT
  // -------------------------
  {
    name: "createComment",
    arguments: {
      token: { type: "string", required: true },
      ticket_id: { type: "number", required: true },
      body: { type: "string", required: true },
      system_generated: { type: "boolean" },
    },
    implementation: async (args) => {
      try {
        const payload = { comment: { body: args.body } };
        if (args.system_generated !== undefined)
          payload.comment.system_generated = args.system_generated;

        const res = await api.post(
          `/tickets/${args.ticket_id}/comments`,
          payload,
          authHeader(args.token)
        );

        return {
          success: true,
          message: "Comment created",
          comment: res.data.comment || res.data,
        };
      } catch (err) {
        console.error("createComment error:", err.response?.data || err.message);
        return {
          success: false,
          message:
            err.response?.data?.errors?.join?.(", ") ||
            err.response?.data?.error ||
            err.message,
          details: err.response?.data,
        };
      }
    },
  },

  // -------------------------
  // UPDATE COMMENT
  // -------------------------
  {
    name: "updateComment",
    arguments: {
      token: { type: "string", required: true },
      ticket_id: { type: "number", required: true },
      comment_id: { type: "number", required: true },
      body: { type: "string", required: true },
    },
    implementation: async (args) => {
      try {
        const payload = { comment: { body: args.body } };

        const res = await api.put(
          `/tickets/${args.ticket_id}/comments/${args.comment_id}`,
          payload,
          authHeader(args.token)
        );

        return {
          success: true,
          message: "Comment updated",
          comment: res.data.comment || res.data,
        };
      } catch (err) {
        console.error("updateComment error:", err.response?.data || err.message);
        return {
          success: false,
          message:
            err.response?.data?.errors?.join?.(", ") ||
            err.response?.data?.error ||
            err.message,
          details: err.response?.data,
        };
      }
    },
  },

  // -------------------------
  // DELETE COMMENT
  // -------------------------
  {
    name: "deleteComment",
    arguments: {
      token: { type: "string", required: true },
      ticket_id: { type: "number", required: true },
      comment_id: { type: "number", required: true },
    },
    implementation: async (args) => {
      try {
        const res = await api.delete(
          `/tickets/${args.ticket_id}/comments/${args.comment_id}`,
          authHeader(args.token)
        );

        return {
          success: true,
          message: res.data.message || "Comment deleted",
        };
      } catch (err) {
        console.error("deleteComment error:", err.response?.data || err.message);
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
