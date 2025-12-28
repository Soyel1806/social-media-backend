/**
 * Logging utility with different verbosity levels (ESM Version)
 */

export const LOG_LEVELS = {
  VERBOSE: "verbose",
  CRITICAL: "critical",
};

const currentLogLevel = process.env.LOG_LEVEL || LOG_LEVELS.VERBOSE;

/**
 * Log verbose messages (debug, info, etc.)
 * @param  {...any} args - Arguments to log
 */
export const verbose = (...args) => {
  if (currentLogLevel === LOG_LEVELS.VERBOSE) {
    console.log("[VERBOSE]", new Date().toISOString(), ...args);
  }
};

/**
 * Log critical messages (errors, warnings, etc.)
 * @param  {...any} args - Arguments to log
 */
export const critical = (...args) => {
  console.error("[CRITICAL]", new Date().toISOString(), ...args);
};
