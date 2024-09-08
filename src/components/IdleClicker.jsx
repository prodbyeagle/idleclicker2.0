import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';

const IdleClicker = () => {
   const { t, i18n } = useTranslation();
   const [points, setPoints] = useState(0);
   const [isCoolingDown, setIsCoolingDown] = useState(false);
   const cooldownTimer = useRef(null);

   useEffect(() => {
      // Lade UserData inklusive der gespeicherten Punkte und Sprache
      const { points: savedPoints, settings } = loadUserData();
      setPoints(savedPoints || 0); // Setze die Punkte oder 0, wenn keine gespeichert sind

      // Falls eine Sprache gespeichert wurde, wende sie an
      if (settings?.language) {
         i18n.changeLanguage(settings.language);
      }
   }, [i18n]);

   const handleClick = () => {
      if (isCoolingDown) return;

      setPoints((prevPoints) => {
         const newPoints = prevPoints + 1;

         // Speichere die neuen Punkte und die aktuelle Sprache
         const data = {
            points: newPoints, // Keine doppelte userData-Ebene
            settings: { language: i18n.language }
         };
         saveUserData(data);

         return newPoints;
      });

      setIsCoolingDown(true);

      cooldownTimer.current = setTimeout(() => {
         setIsCoolingDown(false);
      }, 50);
   };

   return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center">
         <h1 className="text-4xl font-bold mb-4">Idle Clicker 2.0</h1>
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