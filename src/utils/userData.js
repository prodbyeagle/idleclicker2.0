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
         console.debug('Loaded user data:', data); // Debug logging
         return data;
      } catch (error) {
         console.error('Failed to parse saved data:', error);
         return { upgrades: [], points: 0, settings: {} };
      }
   }
   return { upgrades: [], points: 0, settings: {} }; // Default values if nothing is saved
};

/**
 * Save user data to localStorage.
 * @param {object} newData - The new data to merge with existing data.
 */
export const saveUserData = (newData) => {
   try {
      const existingData = loadUserData();
      const updatedData = {
         ...existingData,
         ...newData // Merge newData with existingData
      };
      console.debug('Saving user data:', updatedData); // Debug logging
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
   } catch (error) {
      console.error('Failed to save data:', error);
   }
};