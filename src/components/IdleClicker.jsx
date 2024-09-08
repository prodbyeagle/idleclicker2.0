import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';

const IdleClicker = () => {
   const { t } = useTranslation();
   const [points, setPoints] = useState(0);
   const [isCoolingDown, setIsCoolingDown] = useState(false);
   const cooldownTimer = useRef(null);

   useEffect(() => {
      // Load data from userData
      const { gameSave } = loadUserData();
      console.log('Loaded user data:', gameSave); // Debugging log
      setPoints(gameSave.points || 0); // Ensure points are set from saved data
   }, []);

   const handleClick = () => {
      if (isCoolingDown) return;

      // Update points
      setPoints(prevPoints => {
         const newPoints = prevPoints + 1;

         // Save data to userData when points are updated
         const data = { gameSave: { points: newPoints } };
         saveUserData(data);
         console.log('Saved user data:', data); // Debugging log

         return newPoints;
      });

      setIsCoolingDown(true);

      cooldownTimer.current = setTimeout(() => {
         setIsCoolingDown(false);
      }, 50);

      console.log('Points incremented to:', points + 1); // Debugging log
   };

   return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center">
         <h1 className="text-4xl font-bold mb-4">{t('idleClickerTitle')}</h1>
         <p className="text-2xl mb-4">{t('points')}: {points}</p>
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
