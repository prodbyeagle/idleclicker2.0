import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadUserData, saveUserData } from '../utils/userData';
import formatNumber from '../utils/formatNumber';
import Modal from './Modal';
import Button from './Button';
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
      debugLog('Loaded user settings:', settings);
   }, [i18n.language]);

   useEffect(() => {
      const data = loadUserData();
      data.settings = { language };
      saveUserData(data);
      i18n.changeLanguage(language);
      debugLog('Updated settings and changed language to:', language);
   }, [language, i18n]);

   const handleLanguageChange = (event) => {
      setLanguage(event.target.value);
      debugLog('Language changed to:', event.target.value);
   };

   const handleResetData = () => {
      localStorage.clear();
      setIsResetModalOpen(false);
   };

   const handleExportData = () => {
      const data = JSON.stringify(loadUserData());
      debugLog(data);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'userData.json';
      a.click();
      URL.revokeObjectURL(url);
      debugLog('Data exported to userData.json');
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
               debugLog('Import preview:', preview);
            } catch (error) {
               console.error(t('dataImportError'));
               debugLog('Error importing data:', error);
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
               debugLog('Imported data:', data);
               setIsImportModalOpen(false);
            } catch (error) {
               console.error(t('dataImportError'));
               debugLog('Error accepting import data:', error);
            }
         };
         reader.readAsText(file);
      }
   };

   const add500kPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 500000;
      saveUserData(userData);
      debugLog('Added 500k points. New points total:', userData.points);
   };

   const add1mPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 1000000;
      saveUserData(userData);
      debugLog('Added 500k points. New points total:', userData.points);
   };

   const add10mPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 10000000;
      saveUserData(userData);
      debugLog('Added 500k points. New points total:', userData.points);
   };

   const add100mPoints = () => {
      const userData = loadUserData();
      userData.points = (userData.points || 0) + 100000000;
      saveUserData(userData);
      debugLog('Added 500k points. New points total:', userData.points);
   };

   return (
      <div className="space-y-4">
         <h2 className="text-3xl font-semibold mb-6">{t('settings')}</h2>

         <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('language')}</h3>
            <select
               value={language}
               onChange={handleLanguageChange}
               className="bg-neutral-700 text-neutral-100 p-2 rounded-lg border border-neutral-600"
            >
               <option value="en">English</option>
               <option value="de">Deutsch</option>
            </select>
         </div>

         <div className="bg-neutral-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('generalSettings')}</h3>
            <p className="text-lg mb-2">{t('customizeExperience')}</p>

            <div className="flex space-x-2">
               <Button
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-white"
                  variant="primary"
               >
                  {t('resetData')}
               </Button>

               <Button
                  onClick={() => setIsExportModalOpen(true)}
                  className="text-white"
                  variant="primary"
               >
                  {t('exportData')}
               </Button>

               <label className="bg-blue-600 hover:bg-blue-700 duration-200 transition-all text-white px-4 py-2 rounded cursor-pointer flex items-center space-x-2">
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
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white"
                  variant="primary"
               >
                  Add 500k Points
               </Button>
               <Button
                  onClick={add1mPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white"
                  variant="primary"
               >
                  Add 1m Points
               </Button>
               <Button
                  onClick={add10mPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white"
                  variant="primary"
               >
                  Add 10m Points
               </Button>
               <Button
                  onClick={add100mPoints}
                  className="bg-green-600 hover:bg-green-700 duration-200 transition-all text-white"
                  variant="primary"
               >
                  Add 100m Points
               </Button>
            </div>
         </div>

         <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
            <h2 className="text-3xl font-semibold mb-6">{t('confirmReset')}</h2>
            <div className="flex space-x-2">
               <Button
                  onClick={handleResetData}
                  className="text-white"
                  variant="primary"
               >
                  {t('resetData')}
               </Button>
            </div>
         </Modal>

         <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
            <h2 className="text-3xl font-semibold mb-6">{t('confirmExport')}</h2>
            <div className="flex space-x-2">
               <Button
                  onClick={handleExportData}
                  className="text-white"
                  variant="primary"
               >
                  {t('exportData')}
               </Button>
            </div>
         </Modal>

         <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
            <h2 className="text-3xl font-semibold mb-6">{t('dataImport')}</h2>
            <div className="mb-4">
               <p><strong>{t('points')}:</strong> {importPreview?.points}</p>
               <p><strong>{t('language')}:</strong> {importPreview?.language}</p>
            </div>
            <div className="flex space-x-2">
               <Button
                  onClick={handleAcceptImport}
                  className="text-white"
                  variant="primary"
               >
                  {t('acceptImport')}
               </Button>
               <Button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-white"
                  variant="secondary"
               >
                  {t('declineImport')}
               </Button>
            </div>
         </Modal>
      </div>
   );
};

export default Settings;
