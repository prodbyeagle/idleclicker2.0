import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import upgradesData from '../data/upgrades.json';
import { loadUserData, saveUserData } from '../utils/userData';
import { debugLog } from '../utils/debug';
import Toast from './Toast';

const currentVersion = '1.0.0';

const Upgrades = () => {
   const { t } = useTranslation();
   const [upgrades, setUpgrades] = useState([]);
   const [showToast, setShowToast] = useState(false);
   const [toastMessage, setToastMessage] = useState('');
   const [borderClass, setBorderClass] = useState('');
   const [points, setPoints] = useState(0);

   useEffect(() => {
      const savedData = loadUserData();
      debugLog('Loaded user data:', savedData);

      setPoints(savedData.points);

      let fullUpgrades = upgradesData.upgrades.map((upgrade) => {
         const userUpgrade = savedData.upgrades.find(u => u.id === upgrade.id) || {};

         // Hier könntest du Entsperr-Logik hinzufügen, z.B. wenn Punkte ausreichen
         const isUnlocked = userUpgrade.level > 0 || (savedData.points >= upgrade.cost);

         debugLog(`Initializing upgrade ${upgrade.id}:`, {
            ...upgrade,
            level: userUpgrade.level || 0,
            unlocked: isUnlocked
         });

         return {
            ...upgrade,
            level: userUpgrade.level || 0,
            unlocked: isUnlocked
         };
      });

      debugLog('Merged upgrades:', fullUpgrades);
      setUpgrades(fullUpgrades);
   }, []);

   const saveUserDataToStorage = (updatedUpgrades) => {
      const simplifiedUpgrades = updatedUpgrades.map(({ id, level, unlocked }) => ({
         id,
         level,
         unlocked
      }));

      const updatedData = {
         version: currentVersion,
         upgrades: simplifiedUpgrades,
         points: points
      };
      debugLog('Saving user data:', updatedData);
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
      debugLog('User points before purchase:', points);

      let purchaseSuccessful = false;
      const updatedUpgrades = upgrades.map((upgrade) => {
         debugLog(`Upgrade ${upgrade.name}: Cost - ${upgrade.cost}, Level - ${upgrade.level}/${upgrade.maxLevel}, Unlocked - ${upgrade.unlocked}`);

         if (upgrade.id === id && upgrade.unlocked && points >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
            // Calculate new points and level
            const newPoints = points - upgrade.cost;
            debugLog(`Points after purchase: ${newPoints}`);

            // Update state with new points and upgrade level
            setPoints(newPoints);
            purchaseSuccessful = true;
            return {
               ...upgrade,
               level: upgrade.level + 1
            };
         }
         return upgrade;
      });

      if (!purchaseSuccessful) {
         setToastMessage(t('purchaseFailed'));
         setBorderClass('border-red-500 blur-effect');
         setShowToast(true);
         setTimeout(() => {
            setBorderClass('');
            setShowToast(false);
         }, 3000);
         debugLog('Purchase failed. Either not enough points, upgrade is locked, or max level reached.');
         return; // Exit early if purchase failed
      }

      // Update upgrades and save data after points are set
      setUpgrades(updatedUpgrades);
      saveUserDataToStorage(updatedUpgrades);

      setToastMessage(t('purchaseSuccess'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
                  <p>{t('upgradeCost')}: 🪙 {upgrade.cost}</p>

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
               message={toastMessage}
               type="error"
               onClose={() => setShowToast(false)}
            />
         )}
      </div>
   );
};

export default Upgrades;