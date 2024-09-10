import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import upgradesData from '../data/upgrades.json';
import { loadUserData, saveUserData } from '../utils/userData';
import formatNumber from '../utils/formatNumber';
import { debugLog } from '../utils/debug';
import Toast from './Toast';

const currentVersion = '1.2';

const rarityOrder = {
   'common': 1,
   'rare': 2,
   'epic': 3,
   'legendary': 4
};

const Upgrades = () => {
   const { t } = useTranslation();
   const [upgrades, setUpgrades] = useState([]);
   const [showToast, setShowToast] = useState(false);
   const [toastMessage, setToastMessage] = useState('');
   const [borderClass, setBorderClass] = useState('');
   const [points, setPoints] = useState(0);
   const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

   useEffect(() => {
      const savedData = loadUserData();
      debugLog('Loaded user data:', savedData);

      setPoints(savedData.points);

      let fullUpgrades = upgradesData.upgrades.map((upgrade) => {
         const userUpgrade = savedData.upgrades.find(u => u.id === upgrade.id) || {};
         return {
            ...upgrade,
            level: userUpgrade.level || 0
         };
      });

      fullUpgrades.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

      debugLog('Merged and sorted upgrades:', fullUpgrades);
      setUpgrades(fullUpgrades);
   }, []);

   useEffect(() => {
      const handleResize = () => {
         setIsCollapsed(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const saveUserDataToStorage = (updatedUpgrades, updatedPoints) => {
      const simplifiedUpgrades = updatedUpgrades.map(({ id, level }) => ({
         id,
         level
      }));

      const updatedData = {
         version: currentVersion,
         upgrades: simplifiedUpgrades,
         points: updatedPoints // Speichere die neuen Punkte
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
         const baseCost = upgrade.cost;
         const costMultiplier = upgrade.costMultiplier || 1;
         const currentCost = baseCost * Math.pow(costMultiplier, upgrade.level);

         debugLog(`Upgrade ${upgrade.name}: Cost - ${currentCost}, Level - ${upgrade.level}/${upgrade.maxLevel}`);

         if (upgrade.id === id && points >= currentCost && upgrade.level < upgrade.maxLevel) {
            purchaseSuccessful = true;
            return {
               ...upgrade,
               level: upgrade.level + 1,
               unlocked: true
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
         debugLog('Purchase failed. Either not enough points or max level reached.');
         return;
      }

      // Finde das Upgrade, das gekauft wurde
      const upgradePurchased = upgrades.find(upgrade => upgrade.id === id);
      const baseCost = upgradePurchased.cost;
      const costMultiplier = upgradePurchased.costMultiplier || 1;
      const currentCost = baseCost * Math.pow(costMultiplier, upgradePurchased.level);

      // Aktualisiere die Punkte und speichere sie
      const newPoints = points - currentCost;
      setPoints(newPoints);
      debugLog(`Points after purchase: ${newPoints}`);

      // Speichere die aktualisierten Upgrades und Punkte
      setUpgrades(updatedUpgrades);
      saveUserDataToStorage(updatedUpgrades, newPoints); // Übergib auch die neuen Punkte

      setToastMessage(t('purchaseSuccess'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
   };

   return (
      <div className={`space-y-4 ${borderClass} ${isCollapsed ? 'ml-6' : ''}`}>
         <h2 className="text-3xl font-semibold mb-6">{t('availableUpgrades')}</h2>

         <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {upgrades.map((upgrade) => {
               const baseCost = upgrade.cost;
               const costMultiplier = upgrade.costMultiplier || 1;
               const currentCost = baseCost * Math.pow(costMultiplier, upgrade.level);

               return (
                  <div
                     key={upgrade.id}
                     className={`p-4 rounded-lg shadow-md bg-neutral-800 ${upgrade.level >= upgrade.maxLevel ? 'relative' : ''}`}
                     style={{
                        borderLeft: `4px solid ${getRarityColor(upgrade.rarity)}`,
                     }}
                  >
                     {upgrade.level >= upgrade.maxLevel && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white px-2 py-1 rounded-full text-xs">
                           {t('maxedUpgrade')}
                        </div>
                     )}
                     <h3 className={`text-xl font-bold ${upgrade.level >= upgrade.maxLevel ? '' : ''}`}>
                        {upgrade.name} {upgrade.level > 0 ? `(Lv. ${upgrade.level}/${upgrade.maxLevel})` : ''}
                     </h3>
                     <p>{t('description')}: {upgrade.level >= upgrade.maxLevel ? upgrade.levels[upgrade.maxLevel] : (upgrade.levels ? upgrade.levels[upgrade.level + 1] : upgrade.effect)}</p>
                     <p>{t('upgradeCost')}: 🪙 {formatNumber(currentCost)}</p>

                     <Button
                        onClick={() => handlePurchase(upgrade.id)}
                        disabled={points < currentCost || upgrade.level >= upgrade.maxLevel}
                        className={`mt-2 text-white
                              ${upgrade.level >= upgrade.maxLevel
                              ? 'bg-green-900/50 hover:bg-green-900/50 cursor-not-allowed'
                              : points < currentCost
                                 ? 'bg-neutral-600 hover:bg-neutral-600 cursor-not-allowed'
                                 : 'bg-primary hover:bg-primary-dark'}`}
                        variant="primary"
                     >
                        {upgrade.level >= upgrade.maxLevel ? t('maxLevelReached') : t('buyUpgrade')}
                     </Button>
                  </div>
               );
            })}
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