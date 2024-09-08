// src/utils/userData.js

const STORAGE_KEY = 'userData'; // Key for localStorage

/**
 * Load user data from localStorage.
 * @returns {object} The user data, including gameSave and settings.
 */
export const loadUserData = () => {
   const savedData = localStorage.getItem(STORAGE_KEY);
   if (savedData) {
      try {
         const data = JSON.parse(savedData);
         return data;
      } catch (error) {
         console.error('Failed to parse saved data:', error);
         return { gameSave: {}, settings: {} };
      }
   }
   return { gameSave: {}, settings: {} };
};

/**
 * Save user data to localStorage.
 * @param {object} newData - The new data to merge with existing data.
 */
export const saveUserData = (newData) => {
   try {
      // Load existing data
      const existingData = loadUserData();

      const updatedData = {
         ...existingData,
         gameSave: {
            ...existingData.gameSave,
            ...newData.gameSave
         }
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
   } catch (error) {
      console.error('Failed to save data:', error);
   }
};