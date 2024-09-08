import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import upgradesData from '../data/upgrades.json';
import { loadUserData, saveUserData } from '../utils/userData';
import { debugLog } from '../utils/debug';
import Toast from './Toast'; // Import Toast component

const currentVersion = '1.0.0'; // Current version of your upgrades

const Upgrades = ({ points, setPoints }) => {
   const { t } = useTranslation();
   const [upgrades, setUpgrades] = useState([]);
   const [showToast, setShowToast] = useState(false);
   const [borderClass, setBorderClass] = useState('');

   useEffect(() => {
      const savedData = loadUserData();
      debugLog('Loaded user data:', savedData);

      let initialUpgrades = upgradesData.upgrades; // Default upgrades data

      if (savedData?.version === currentVersion) {
         initialUpgrades = savedData.upgrades || upgradesData.upgrades;
      }

      debugLog('Initial upgrades:', initialUpgrades);
      setUpgrades(initialUpgrades);
   }, []);

   const saveUserDataToStorage = (updatedUpgrades) => {
      const updatedData = {
         version: currentVersion,
         upgrades: updatedUpgrades,
         points
      };
      debugLog('Saving user data to storage:', updatedData);
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
      debugLog('Attempting to purchase upgrade with id:', id);

      let purchaseSuccessful = false;
      const updatedUpgrades = upgrades.map((upgrade) => {
         if (upgrade.id === id && upgrade.unlocked && points >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
            setPoints((prevPoints) => prevPoints - upgrade.cost);
            debugLog(`Upgrading ${upgrade.name} to level ${upgrade.level + 1}`);
            purchaseSuccessful = true;
            return {
               ...upgrade,
               level: upgrade.level + 1
            };
         }
         return upgrade;
      });

      setUpgrades(updatedUpgrades);
      saveUserDataToStorage(updatedUpgrades);

      if (purchaseSuccessful) {
         // Reset border on successful purchase
         setBorderClass('');
         setShowToast(true);
         setTimeout(() => setShowToast(false), 3000);
      } else {
         // Apply red border on failed purchase
         setBorderClass('border-red-500 blur-effect');
         setShowToast(true);
         setTimeout(() => {
            setBorderClass('');
            setShowToast(false);
         }, 3000);
      }
   };

   return (
      <div className={`space-y-4 ${borderClass}`}>
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
                  <p>{t('description')}: {upgrade.levels ? upgrade.levels[upgrade.level + 1] : upgrade.effect}</p>
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

         {showToast && (
            <Toast
               message={t('purchaseFailed')}
               type="error"
               onClose={() => setShowToast(false)}
            />
         )}
      </div>
   );
};

export default Upgrades;