// index.js
const { RetoolRPC } = require("retoolrpc");
const dotenv = require("dotenv");
dotenv.config();

const rpcFunctions = require("./rpc.js"); // will be an array of function definitions

// Read required env vars
const RETOOL_API_TOKEN = process.env.RETOOL_API_TOKEN;
const RETOOL_HOST = process.env.RETOOL_HOST;
const RETOOL_RESOURCE_ID = process.env.RETOOL_RESOURCE_ID;

if (!RETOOL_API_TOKEN || !RETOOL_HOST || !RETOOL_RESOURCE_ID) {
  console.warn("⚠️  Missing RETOOL_API_TOKEN or RETOOL_HOST or RETOOL_RESOURCE_ID in .env");
  console.warn("Please set RETOOL_API_TOKEN, RETOOL_HOST, RETOOL_RESOURCE_ID in .env before starting.");
}

// Initialize Retool RPC client
const rpc = new RetoolRPC({
  apiToken: RETOOL_API_TOKEN,
  host: RETOOL_HOST,
  resourceId: RETOOL_RESOURCE_ID,
  environmentName: process.env.RETOOL_ENV || "production",
  pollingIntervalMs: 1000,
  version: "0.0.1",
  logLevel: process.env.RPC_LOG_LEVEL || "info",
});

// Register functions (rpcFunctions is an array)
for (const fn of rpcFunctions) {
  rpc.register({
    name: fn.name,
    arguments: fn.arguments || {},
    implementation: fn.implementation,
  });
  console.log(`✅ Registered RPC function: ${fn.name}`);
}

// Start agent
(async () => {
  try {
    console.log("Starting RPC agent");
    await rpc.listen();
    console.log("🚀 Retool RPC Server listening and functions registered.");
  } catch (err) {
    console.error("Error registering agent:", err && err.message ? err.message : err);
  }
})();
