import debugData from '../game-config.json';

let debug = debugData.debug || false;

/**
 * Logs debug messages to the console if debug mode is enabled.
 * 
 * @param {...any} args - The messages or objects to log.
 */
export const debugLog = (...args) => {
   if (debug) {
      console.log('DEBUG:', ...args);
   }
};