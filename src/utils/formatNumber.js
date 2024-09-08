/**
 * Formats a number into a more readable string with suffixes like k, m, b, t, etc.
 *
 * @param {number} value - The number to format.
 * @returns {string} The formatted number.
 */
const formatNumber = (value) => {
   if (typeof value !== 'number' || isNaN(value)) {
      return 'n/a'; // Handle invalid input
   }

   const suffixes = ['k', 'm', 'b', 't', 'q', 'r', 's', 'o', 'n']; // Added more suffixes
   const tier = Math.log10(Math.abs(value)) / 3 | 0; // Use Math.abs to handle negative numbers

   if (tier === 0) return value.toString();

   const suffix = suffixes[tier - 1];
   const scale = Math.pow(10, tier * 3);

   // Format the number to one decimal place if needed
   const scaled = value / scale;
   return scaled.toFixed(1) + suffix;
};

export default formatNumber;