import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';
import formatNumber from '../utils/formatNumber';
import upgradeData from '../data/upgrades.json';
import useAutoClicker from '../utils/autoClicker';
import Tooltip from './Tooltip';
import { debugLog } from '../utils/debug';

/**
 * IdleClicker component represents the main game interface for an idle clicker game.
 *
 * Handles user points, upgrades, auto-clicker functionality, and debug mode.
 *
 * @component
 */
const IdleClicker = () => {
   const { t, i18n } = useTranslation();
   const [points, setPoints] = useState(0);
   const [isCoolingDown, setIsCoolingDown] = useState(false);
   const [userUpgrades, setUserUpgrades] = useState([]);
   const [showExtendedPoints, setShowExtendedPoints] = useState(false);
   const [isAutoClickerActive, setIsAutoClickerActive] = useState(false); // Auto-Clicker State
   const cooldownTimer = useRef(null);

   useEffect(() => {
      const { points: savedPoints, settings, upgrades } = loadUserData();
      setPoints(savedPoints || 0);
      setUserUpgrades(upgrades || []);
      setShowExtendedPoints(settings?.showExtendedPoints || false);

      if (settings?.language) {
         i18n.changeLanguage(settings.language);
      }
   }, [i18n]);

   /**
    * Adds points earned from auto-clicker to the total points.
    *
    * @param {number} pointsEarned - The amount of points to add.
    */
   const addAutoClickPoints = (pointsEarned) => {
      setPoints((prevPoints) => {
         const newPoints = prevPoints + pointsEarned;
         saveUserData({
            points: newPoints,
            settings: { language: i18n.language, showExtendedPoints },
            upgrades: userUpgrades
         });
         return newPoints;
      });
   };

   const autoClickerUpgrade = userUpgrades.find(upgrade => upgrade.id === 5);
   useAutoClicker(autoClickerUpgrade, addAutoClickPoints, isAutoClickerActive);

   /**
    * Applies the user's upgrades to determine click bonus and multiplier.
    *
    * @returns {Object} - Contains totalClickBonus and clickMultiplier.
    */
   const applyUpgrades = () => {
      let totalClickBonus = 0;
      let clickMultiplier = 1;

      userUpgrades.forEach((userUpgrade) => {
         const upgradeDefinition = upgradeData.upgrades.find(u => u.id === userUpgrade.id);
         if (upgradeDefinition && userUpgrade.level > 0) {
            const upgradeLevel = userUpgrade.level;
            switch (upgradeDefinition.name) {
               case 'Auto Clicker':
                  break;
               case 'Double Click':
                  clickMultiplier = Math.max(clickMultiplier, upgradeLevel * 2);
                  break;
               case 'Triple Click':
                  clickMultiplier = Math.max(clickMultiplier, upgradeLevel * 3);
                  break;
               case 'Mega Clicker':
                  totalClickBonus += 5 * (upgradeLevel + 1);
                  break;
               case 'Multiplier Boost':
                  clickMultiplier *= upgradeLevel + 2;
                  break;
               default:
                  break;
            }
         }
      });

      return { totalClickBonus, clickMultiplier };
   };

   /**
    * Handles click events to update points and manage cooldown.
    */
   const handleClick = () => {
      if (isCoolingDown) return;

      const { totalClickBonus, clickMultiplier } = applyUpgrades();

      setPoints((prevPoints) => {
         const pointsEarned = 1 * clickMultiplier + totalClickBonus;
         const newPoints = prevPoints + pointsEarned;
         const data = {
            points: newPoints,
            settings: { language: i18n.language, showExtendedPoints },
            upgrades: userUpgrades
         };
         saveUserData(data);

         return newPoints;
      });

      setIsCoolingDown(true);

      cooldownTimer.current = setTimeout(() => {
         setIsCoolingDown(false);
      }, 75);
   };

   /**
    * Toggles the auto-clicker state.
    */
   const toggleAutoClicker = () => {
      setIsAutoClickerActive(prevState => !prevState);
      debugLog('toggleAutoClicker', 'Auto-clicker toggled:', !isAutoClickerActive);
   };

   return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center relative">
         <h1 className="text-4xl font-bold mb-4">Idle Clicker 2.0</h1>
         <p className="text-3xl mb-4">{t('points')}: {formatNumber(points)}</p>
         {showExtendedPoints && (
            <p className="text-xl mb-4">{points}</p>
         )}

         <Button
            onClick={handleClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer active:scale-95"
            variant="primary"
            disabled={isCoolingDown}
         >
            {t('clickButton')}
         </Button>

         {autoClickerUpgrade && autoClickerUpgrade.level > 0 && (
            <Button
               onClick={toggleAutoClicker}
               className={`px-6 py-2 ${isAutoClickerActive ? 'bg-green-600' : 'bg-red-600'} text-white rounded-lg cursor-pointer mt-2`}
               variant="primary"
            >
               {isAutoClickerActive ? t('autoClickerOn') : t('autoClickerOff')}
            </Button>
         )}

         <div className="absolute top-4 right-4 w-80 bg-neutral-800 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-neutral-100">{t('activeUpgrades')}</h2>
            <ul className="text-sm text-neutral-200">
               {userUpgrades.map((upgrade) => {
                  const upgradeDefinition = upgradeData.upgrades.find(u => u.id === upgrade.id);
                  if (upgradeDefinition && upgrade.level > 0) {
                     return (
                        <li key={upgrade.id} className="relative mb-3 py-3 px-4 rounded-lg bg-neutral-700 border-l-4 border-blue-500 hover:bg-blue-600 hover:text-neutral-100 transition-all duration-300 ease-in-out flex items-center cursor-pointer">
                           <Tooltip content={upgradeDefinition.effect} position="top">
                              <span className="flex-1">{upgradeDefinition.name} (Lv. {upgrade.level}/{upgradeDefinition.maxLevel || "Error"})</span>
                           </Tooltip>
                        </li>
                     );
                  }
                  return null;
               })}
            </ul>
         </div>
      </div>
   );
};

export default IdleClicker;
