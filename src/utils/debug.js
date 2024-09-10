import { loadUserData } from "./userData";

let userData = loadUserData();
let debug = userData?.settings?.debug === true;

/**
 * Logs debug messages to the console if debug mode is enabled.
 * 
 * @param {string} functionName - The name of the function where the log originates.
 * @param {...any} args - The messages or objects to log.
 */
export const debugLog = (functionName, ...args) => {
   if (debug) {
      const style = 'color: green; font-weight: bold; text-transform: uppercase;';
      console.log(`%cDEBUG [${functionName.toUpperCase()}]:`, style, ...args);
   }
};