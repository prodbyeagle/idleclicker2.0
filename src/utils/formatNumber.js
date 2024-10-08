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

   // Format the number to two decimal places
   const scaled = value / scale;
   let formattedNumber = scaled.toFixed(2);

   // If the number ends with ".00", remove the decimal part
   if (formattedNumber.endsWith('.00')) {
      formattedNumber = Math.round(scaled).toString();
   }

   return formattedNumber + suffix;
};

export default formatNumber;