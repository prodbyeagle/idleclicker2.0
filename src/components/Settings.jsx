import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';
import formatNumber from '../utils/formatNumber';
import Modal from './Modal';
import Button from './Button';
import Checkbox from './Checkbox';  // Importiere CustomCheckbox
import { debugLog } from '../utils/debug';

const Settings = () => {
   const { t, i18n } = useTranslation();
   const [language, setLanguage] = useState(i18n.language);
   const [isResetModalOpen, setIsResetModalOpen] = useState(false);
   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
   const [isImportModalOpen, setIsImportModalOpen] = useState(false);
   const [importPreview, setImportPreview] = useState(null);

   useEffect(() => {
      const { settings } = loadUserData();
      setLanguage(settings?.language || i18n.language);
   }, [i18n.language]);

   useEffect(() => {
      const data = loadUserData();
      data.settings = { language };
      saveUserData(data);
      debugLog('useEffect (settings update)', 'Updated settings with language and showExtendedPoints:', data.settings);
   }, [language]);

   useEffect(() => {
      i18n.changeLanguage(language);
      debugLog('useEffect (language change)', 'Updated settings and changed language to:', language);
   }, [language, i18n]);

   const handleLanguageChange = (event) => {
      setLanguage(event.target.value);
      debugLog('handleLanguageChange', 'Language changed to:', event.target.value);
   };

   const handleResetData = () => {
      localStorage.clear();
      setIsResetModalOpen(false);
      debugLog('handleResetData', 'Local storage cleared.');
   };

   const handleExportData = () => {
      const data = JSON.stringify(loadUserData());
      debugLog('handleExportData', 'Exported data:', data);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'userData.json';
      a.click();
      URL.revokeObjectURL(url);
      debugLog('handleExportData', 'Data exported to userData.json');
      setIsExportModalOpen(false);
   };

   const handleImportData = (event) => {
      const file = event.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
            try {
               const data = JSON.parse(e.target.result);
               const preview = {
                  points: data.points ? formatNumber(data.points) : 'N/A',
                  language: data.settings?.language || 'N/A'
               };
               setImportPreview(preview);
               setIsImportModalOpen(true);
               debugLog('handleImportData', 'Import preview:', preview);
            } catch (error) {
               console.error(t('dataImportError'));
               debugLog('handleImportData', 'Error importing data:', error);
            }
         };
         reader.readAsText(file);
      }
   };

   const handleAcceptImport = () => {
      const file = document.querySelector('input[type="file"]').files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
            try {
               const data = JSON.parse(e.target.result);
               saveUserData(data);
               debugLog('handleAcceptImport', 'Imported data:', data);
               setIsImportModalOpen(false);
            } catch (error) {
               console.error(t('dataImportError'));
               debugLog('handleAcceptImport', 'Error accepting import data:', error);
            }
         };
         reader.readAsText(file);
      }
   };

   const add500kPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 500000;
      saveUserData(userData);
   };

   const add1mPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 1000000;
      saveUserData(userData);
   };

   const add10mPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 10000000;
      saveUserData(userData);
   };

   const add100mPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 100000000;
      saveUserData(userData);
   };

   return (
      <div className="space-y-4 px-4 sm:px-6 lg:px-8">
         <h2 className="text-3xl font-semibold mb-6">{t('settings')}</h2>

         <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('language')}</h3>
            <select
               value={language}
               onChange={handleLanguageChange}
               className="bg-neutral-700 text-neutral-100 p-2 rounded-lg border border-neutral-600 w-full sm:w-auto"
            >
               <option value="en">🇺🇸 English</option>
               <option value="de">🇩🇪 Deutsch</option>
            </select>
         </div>

         <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('generalSettings')}</h3>
            <p className="text-lg mb-2">{t('customizeExperience')}</p>

            <div className="flex flex-wrap gap-2">
               <Button
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-white w-full sm:w-auto"
                  variant="primary"
               >
                  {t('resetData')}
               </Button>

               <Button
                  onClick={() => setIsExportModalOpen(true)}
                  className="text-white w-full sm:w-auto"
                  variant="primary"
               >
                  {t('exportData')}
               </Button>

               <label className="bg-blue-600 hover:bg-blue-700 duration-200 transition-all text-white px-4 py-2 rounded cursor-pointer flex items-center space-x-2 w-full sm:w-auto">
                  <span>{t('importData')}</span>
                  <input
                     type="file"
                     accept=".json"
                     onChange={handleImportData}
                     className="hidden"
                  />
               </label>

               <Button
                  onClick={add500kPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white w-full sm:w-auto"
                  variant="primary"
               >
                  Add 500k Points
               </Button>
               <Button
                  onClick={add1mPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white w-full sm:w-auto"
                  variant="primary"
               >
                  Add 1m Points
               </Button>
               <Button
                  onClick={add10mPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white w-full sm:w-auto"
                  variant="primary"
               >
                  Add 10m Points
               </Button>
               <Button
                  onClick={add100mPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white w-full sm:w-auto"
                  variant="primary"
               >
                  Add 100m Points
               </Button>
            </div>
         </div>

         <div className="flex flex-col gap-2 bg-neutral-800 p-4 rounded-lg">
            <Checkbox
               label={t('showExtendedPoints')}
               disabled={true}
            />

            <Checkbox
               label={t('debugMode')}
               disabled={true}
            />
         </div>

         <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
            <h2 className="text-3xl font-semibold mb-6">{t('confirmReset')}</h2>
            <div className="flex flex-wrap gap-2">
               <Button
                  onClick={handleResetData}
                  className="text-white mt-4 px-4 py-2 sm:w-auto"
                  variant="primary"
               >
                  {t('resetData')}
               </Button>
            </div>
         </Modal>

         <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
            <h2 className="text-3xl font-semibold mb-6">{t('dataExport')}</h2>
            <Button
               onClick={handleExportData}
               className="text-white mt-4 px-4 py-2 sm:w-auto"
               variant="primary"
            >
               {t('exportData')}
            </Button>
         </Modal>

         <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
            <h2 className="text-3xl font-semibold mb-6">{t('importPreview')}</h2>
            {importPreview ? (
               <div className="text-lg mb-4">
                  <p>{t('points')}: {importPreview.points}</p>
                  <p>{t('language')}: {importPreview.language}</p>
                  <Button
                     onClick={handleAcceptImport}
                     className="text-white mt-4 px-4 py-2 sm:w-auto"
                     variant="primary"
                  >
                     {t('importData')}
                  </Button>
               </div>
            ) : (
               <p>{t('dataImportError')}</p>
            )}
         </Modal>
      </div>
   );
};

export default Settings;
