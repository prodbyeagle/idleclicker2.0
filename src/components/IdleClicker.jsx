import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';
import formatNumber from '../utils/formatNumber';
import upgradeData from '../data/upgrades.json'; // Import upgrade data

const IdleClicker = () => {
   const { t, i18n } = useTranslation();
   const [points, setPoints] = useState(0);
   const [isCoolingDown, setIsCoolingDown] = useState(false);
   const [userUpgrades, setUserUpgrades] = useState([]);
   const [showExtendedPoints, setShowExtendedPoints] = useState(false);  // Add state for extended points
   const cooldownTimer = useRef(null);

   useEffect(() => {
      const { points: savedPoints, settings, upgrades } = loadUserData();
      setPoints(savedPoints || 0);
      setUserUpgrades(upgrades || []);
      setShowExtendedPoints(settings?.showExtendedPoints || false);  // Set extended points setting

      if (settings?.language) {
         i18n.changeLanguage(settings.language);
      }
   }, [i18n]);

   const applyUpgrades = () => {
      let totalClickBonus = 0;
      let clickMultiplier = 1;

      userUpgrades.forEach((userUpgrade) => {
         const upgradeDefinition = upgradeData.upgrades.find(u => u.id === userUpgrade.id);
         if (upgradeDefinition && userUpgrade.level > 0) {
            const upgradeLevel = userUpgrade.level;
            switch (upgradeDefinition.name) {
               case 'Auto Clicker':
                  // totalClickBonus += upgradeDefinition.levels[upgradeLevel] || 0;
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

   return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center">
         <h1 className="text-4xl font-bold mb-4">Idle Clicker 2.0</h1>
         <p className="text-2xl mb-4">{t('points')}: {formatNumber(points)}</p>
         {showExtendedPoints && (
            <p className="text-xl mb-4">{points}</p>
         )}
         <Button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg active:scale-95"
            variant="primary"
            disabled={isCoolingDown}
         >
            {t('clickButton')}
         </Button>
      </div>
   );
};

export default IdleClicker;
