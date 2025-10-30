// rpc_implementations_tickets.js
const axios = require("axios");
require("dotenv").config();

const api = axios.create({
  baseURL: process.env.RAILS_BASE_URL,
  timeout: 10000,
});

module.exports = [
  {
    name: "getAllTickets",
    arguments: { token: { type: "string", required: true } },
    implementation: async (args) => {
      const res = await api.get("/tickets", { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "getSingleTicket",
    arguments: { id: { type: "number", required: true }, token: { type: "string", required: true } },
    implementation: async (args) => {
      const res = await api.get(`/tickets/${args.id}`, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "createTicket",
    arguments: {
      title: { type: "string", required: true },
      description: { type: "string", required: true },
      assignee_id: { type: "number" },
      creator_id: { type: "number", required: true },
      status: { type: "string" },
      token: { type: "string", required: true },
    },
    implementation: async (args) => {
      const body = {
        title: args.title,
        description: args.description,
        assignee_id: args.assignee_id,
        creator_id: args.creator_id,
        status: args.status,
      };
      const res = await api.post("/tickets", body, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "updateTicket",
    arguments: {
      id: { type: "number", required: true },
      title: { type: "string" },
      description: { type: "string" },
      status: { type: "string" },
      assignee_id: { type: "number" },
      token: { type: "string", required: true },
    },
    implementation: async (args) => {
      const body = {};
      if (args.title !== undefined) body.title = args.title;
      if (args.description !== undefined) body.description = args.description;
      if (args.status !== undefined) body.status = args.status;
      if (args.assignee_id !== undefined) body.assignee_id = args.assignee_id;

      const res = await api.put(`/tickets/${args.id}`, body, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },

  {
    name: "deleteTicket",
    arguments: { id: { type: "number", required: true }, token: { type: "string", required: true } },
    implementation: async (args) => {
      const res = await api.delete(`/tickets/${args.id}`, { headers: { Authorization: `Bearer ${args.token}` } });
      return res.data;
    },
  },
];
