// src/utils/userData.js

const STORAGE_KEY = 'userData';

/**
 * Load user data from localStorage.
 * @returns {object} The user data, including userData and settings.
 */
export const loadUserData = () => {
   const savedData = localStorage.getItem(STORAGE_KEY);
   if (savedData) {
      try {
         const data = JSON.parse(savedData);
         return data; // Kein doppeltes userData-Schicht hier
      } catch (error) {
         console.error('Failed to parse saved data:', error);
         return { upgrades: [], points: 0, settings: {} };
      }
   }
   return { upgrades: [], points: 0, settings: {} }; // Standardwerte, wenn nichts gespeichert ist
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
         ...newData // Nur die neuen Daten speichern, keine doppelte Struktur
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
   } catch (error) {
      console.error('Failed to save data:', error);
   }
};