// src/utils/userData.js
const STORAGE_KEY = 'userData';

/**
 * Load user data from localStorage.
 * @returns {object} The user data, including upgrades, points, and settings.
 */
export const loadUserData = () => {
   const savedData = localStorage.getItem(STORAGE_KEY);
   if (savedData) {
      try {
         const data = JSON.parse(savedData);
         return {
            ...data,
            settings: {
               ...data.settings,
               showExtendedPoints: data.settings.showExtendedPoints ?? false,
            },
         };
      } catch (error) {
         console.error('Failed to parse saved data:', error);
         return { upgrades: [], points: 0, settings: { language: 'en', showExtendedPoints: false } };
      }
   }
   return { upgrades: [], points: 0, settings: { language: 'en', showExtendedPoints: false } };
};

/**
 * Save user data to localStorage.
 * @param {object} newData - The new data to merge with existing data.
 */
export const saveUserData = (newData) => {
   try {
      const existingData = loadUserData();

      // Merge new settings with existing settings if available
      const updatedSettings = {
         ...existingData.settings,
         ...newData.settings,
      };

      const updatedData = {
         ...existingData,
         ...newData,
         settings: updatedSettings, // Ensure settings are merged properly
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
   } catch (error) {
      console.error('Failed to save data:', error);
   }
};