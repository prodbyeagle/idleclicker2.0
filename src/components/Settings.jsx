import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';

const Settings = () => {
   const { t, i18n } = useTranslation();
   const [language, setLanguage] = useState(i18n.language);

   useEffect(() => {
      // Load settings from userData
      const { settings } = loadUserData();
      setLanguage(settings.language || i18n.language);
   }, [i18n.language]);

   useEffect(() => {
      // Save settings to userData
      const data = loadUserData();
      data.settings = { language };
      saveUserData(data);
      i18n.changeLanguage(language);
   }, [language, i18n]);

   const handleLanguageChange = (event) => {
      setLanguage(event.target.value);
   };

   return (
      <div className="space-y-4">
         <h2 className="text-3xl font-semibold mb-6">{t('settings')}</h2>

         {/* Language Selection */}
         <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('language')}</h3>
            <select
               value={language}
               onChange={handleLanguageChange}
               className="bg-neutral-700 text-neutral-100 p-2 rounded-lg border border-neutral-600"
            >
               <option value="en">English</option>
               <option value="de">Deutsch</option>
               {/* Add more languages as needed */}
            </select>
         </div>

         {/* Additional settings content */}
         <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('generalSettings')}</h3>
            <p className="text-lg mb-2">{t('customizeExperience')}</p>
            {/* Add more settings options as needed */}
         </div>
      </div>
   );
};

export default Settings;