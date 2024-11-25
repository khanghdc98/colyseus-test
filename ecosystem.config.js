const os = require("node:os");
import "dotenv/config";
/**
 * COLYSEUS CLOUD WARNING:
 * ----------------------
 * PLEASE DO NOT UPDATE THIS FILE MANUALLY AS IT MAY CAUSE DEPLOYMENT ISSUES
 */

module.exports = {
	apps: [
		{
			name: "colyseus-app",
			script: "src/index.ts",
			time: true,
			watch: false,
			// instances: os.cpus().length,
			instances: process.env.NO_OF_INSTANCES,
			exec_mode: "fork",
			exec_interpreter: "ts-node",
			wait_ready: true,
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
