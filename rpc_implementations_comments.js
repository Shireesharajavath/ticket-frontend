// rpc_implementations_comments.js
const axios = require("axios");
require("dotenv").config();

const api = axios.create({
  baseURL: process.env.RAILS_BASE_URL,
  timeout: 10000,
});

module.exports = [
  {
    name: "getComments",
    arguments: { ticket_id: { type: "number", required: true }, token: { type: "string", required: true } },
    implementation: async (args) => {
      const res = await api.get(`/tickets/${args.ticket_id}/comments`, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "createComment",
    arguments: {
      ticket_id: { type: "number", required: true },
      user_id: { type: "number", required: true },
      content: { type: "string", required: true },
      token: { type: "string", required: true },
    },
    implementation: async (args) => {
      const body = { user_id: args.user_id, content: args.content };
      const res = await api.post(`/tickets/${args.ticket_id}/comments`, body, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "updateComment",
    arguments: {
      ticket_id: { type: "number", required: true },
      comment_id: { type: "number", required: true },
      content: { type: "string", required: true },
      token: { type: "string", required: true },
    },
    implementation: async (args) => {
      const body = { content: args.content };
      const res = await api.patch(`/tickets/${args.ticket_id}/comments/${args.comment_id}`, body, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "deleteComment",
    arguments: {
      ticket_id: { type: "number", required: true },
      comment_id: { type: "number", required: true },
      token: { type: "string", required: true },
    },
    implementation: async (args) => {
      const res = await api.delete(`/tickets/${args.ticket_id}/comments/${args.comment_id}`, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },
];
