// rpc_implementations_tickets.js
const axios = require("axios");
const { status } = require("init");
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
  // GET /tickets (optional filters: status, priority, assignee_id)
{
  name: "getAllTickets",
  arguments: {
    token: { type: "string", required: true }
  },

  implementation: async (args) => {
    try {
      const res = await api.get("/tickets", {
        ...authHeader(args.token)
      });

      return {
        success: true,
        tickets: res.data,
      };

    } catch (err) {
      console.error("getAllTickets error:", err.response?.data || err.message);

      return {
        success: false,
        message: err.response?.data?.error || err.message,
        details: err.response?.data,
      };
    }
  },
},

  // GET /tickets/:id
  {
    name: "getSingleTicket",
    arguments: { id: { type: "number", required: true }, token: { type: "string", required: true } },
    implementation: async (args) => {
      try {
        const res = await api.get(`/tickets/${args.id}`, authHeader(args.token));
        return { success: true, ticket: res.data };
      } catch (err) {
        console.error("getSingleTicket error:", err.response?.data || err.message);
        return { success: false, message: err.response?.data?.error || err.message, details: err.response?.data };
      }
    },
  },

  // POST /tickets (body: { ticket: { ... } })
  {
    name: "createTicket",
    arguments: {
      token: { type: "string", required: true },
      title: { type: "string", required: true },
      description: { type: "string", required: true },
      status: { type: "string" },
      priority: { type: "string" },
      assignee_id: { type: "number" },
    },
    implementation: async (args) => {
      try {
        const body = {
          ticket: {
            title: args.title,
            description: args.description,
            priority: args.priority,
            assignee_id: args.assignee_id,
          },
        };

        const res = await api.post("/tickets", body, authHeader(args.token));
        return { success: true, message: "Ticket created", ticket: res.data.ticket || res.data };
      } catch (err) {
        console.error("createTicket error:", err.response?.data || err.message);
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

  // PUT /tickets/:id (body: { ticket: { ... } })
  {
    name: "updateTicket",
    arguments: {
      id: { type: "number", required: true },
      token: { type: "string", required: true },
      title: { type: "string" },
      description: { type: "string" },
      status: { type: "string" },
      priority: { type: "string" },
      assignee_id: { type: "number" },
    },
    implementation: async (args) => {
      try {
        // Build nested ticket object because authorize_ticket_update expects params[:ticket]
        const ticket = {};
        if (args.title !== undefined) ticket.title = args.title;
        if (args.description !== undefined) ticket.description = args.description;
        if (args.status !== undefined) ticket.status = args.status;
        if (args.priority !== undefined) ticket.priority = args.priority;
        if (args.assignee_id !== undefined) ticket.assignee_id = args.assignee_id;

        const body = { ticket };

        const res = await api.put(`/tickets/${args.id}`, body, authHeader(args.token));
        return { success: true, message: res.data.message || "Ticket updated", ticket: res.data.ticket || res.data };
      } catch (err) {
        console.error("updateTicket error:", err.response?.data || err.message);
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

  // DELETE is NOT defined in routes (resources :tickets, except: [:destroy]) -> no deleteTicket RPC

  // GET /tickets/search?query=...
  {
    name: "searchTickets",
    arguments: { query: { type: "string", required: true }, token: { type: "string", required: true } },
    implementation: async (args) => {
      try {
        const res = await api.get("/tickets/search", { ...authHeader(args.token), params: { query: args.query } });
        return { success: true, tickets: res.data };
      } catch (err) {
        console.error("searchTickets error:", err.response?.data || err.message);
        return { success: false, message: err.response?.data?.error || err.message, details: err.response?.data };
      }
    },
  },
];
