import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import upgradesData from '../data/upgrades.json';
import { loadUserData, saveUserData } from '../utils/userData';
import { debugLog } from '../utils/debug';  // Import the debugLog function

const Upgrades = ({ points, setPoints }) => {
   const { t } = useTranslation();
   const [upgrades, setUpgrades] = useState([]);

   useEffect(() => {
      const savedData = loadUserData();
      debugLog('Loaded user data:', savedData);  // Debug log
      const initialUpgrades = savedData?.upgrades.length > 0 ? savedData.upgrades : upgradesData.upgrades;
      debugLog('Initial upgrades:', initialUpgrades);  // Debug log
      setUpgrades(initialUpgrades);
   }, []);

   const saveUserDataToStorage = (updatedUpgrades) => {
      const updatedData = {
         upgrades: updatedUpgrades,
         points
      };
      debugLog('Saving user data to storage:', updatedData);  // Debug log
      saveUserData(updatedData);
   };

   const getRarityColor = (rarity) => {
      switch (rarity) {
         case 'common':
            return '#4CAF50';
         case 'rare':
            return '#2196F3';
         case 'epic':
            return '#9C27B0';
         case 'legendary':
            return '#ffd700';
         default:
            return '#9E9E9E';
      }
   };

   const handlePurchase = (id) => {
      debugLog('Attempting to purchase upgrade with id:', id);  // Debug log
      const updatedUpgrades = upgrades.map((upgrade) => {
         if (upgrade.id === id && upgrade.unlocked && points >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
            setPoints((prevPoints) => prevPoints - upgrade.cost);
            debugLog(`Upgrading ${upgrade.name} to level ${upgrade.level + 1}`);  // Debug log
            return {
               ...upgrade,
               level: upgrade.level + 1
            };
         }
         return upgrade;
      });

      setUpgrades(updatedUpgrades);
      saveUserDataToStorage(updatedUpgrades);
   };

   return (
      <div className="space-y-4">
         <h2 className="text-3xl font-semibold mb-6">{t('availableUpgrades')}</h2>

         <div className="grid grid-cols-1 gap-4">
            {upgrades.map((upgrade) => (
               <div
                  key={upgrade.id}
                  className="p-4 rounded-lg shadow-md bg-neutral-800"
                  style={{ borderLeft: `4px solid ${getRarityColor(upgrade.rarity)}`, opacity: upgrade.unlocked ? 1 : 0.5 }}
               >
                  <h3 className="text-xl font-bold">
                     {upgrade.name} {upgrade.level > 0 ? `(Lv. ${upgrade.level}/${upgrade.maxLevel})` : ''}
                  </h3>
                  <p>{t('description')}: {upgrade.effect}</p>
                  <p>{t('upgradeCost')}: 🪙: {upgrade.cost}</p>

                  <Button
                     onClick={() => handlePurchase(upgrade.id)}
                     disabled={points < upgrade.cost || upgrade.level >= upgrade.maxLevel}
                     className="mt-2 text-white"
                     variant="primary"
                  >
                     {upgrade.level >= upgrade.maxLevel ? t('maxLevelReached') : t('buyUpgrade')}
                  </Button>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Upgrades;