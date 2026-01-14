import path from "path";

// We assume the process is running from the 'server' directory (where package.json is located)
const SERVER_ROOT = process.cwd();

export const CONFIG = {
  // The port the server should listen on
  port: 4000,

  // File paths
  paths: {
    // Go up one level from server (..), then into client -> dist -> client -> browser
    angularDist: path.resolve(SERVER_ROOT, "../client/dist/client/browser"),

    // Uploads are located directly in the server folder
    uploads: path.resolve(SERVER_ROOT, "uploads"),
  },
};
