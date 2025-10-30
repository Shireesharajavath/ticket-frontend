const ticketRPC = require("./rpc_implementations_tickets");
const commentRPC = require("./rpc_implementations_comments");
const myviewsRPC = require("./rpc_implementations_myviews");
const authRPC = require("./rpc_implementations_auth");

module.exports = [
  ...authRPC,
  ...ticketRPC,
  ...commentRPC,
  ...myviewsRPC,
];
