import React from 'react';
import { Home, Star, Cog } from 'lucide-react'; // Import Lucide icons
import { useTranslation } from 'react-i18next'; // Import useTranslation
import Button from './Button'; // Import the Button component

const Sidebar = ({ activeTab, setActiveTab }) => {
   const { t } = useTranslation(); // useTranslation Hook verwenden

   return (
      <div className="w-64 bg-neutral-800 p-4 flex flex-col h-full fixed top-0 left-0">
         {/* Sidebar Header */}
         <div className="mb-6 flex items-center space-x-2">
            <Home size={32} className="text-neutral-400" />
            <span className="text-neutral-100 text-2xl font-semibold">Menu</span>
         </div>

         {/* Navigation Buttons */}
         <div className="flex flex-col space-y-2 flex-grow">
            <Button
               onClick={() => setActiveTab('upgrades')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'upgrades' ? 'bg-neutral-700 text-white border-2 border-blue-500' : 'text-neutral-300'}`}
               variant={activeTab === 'upgrades' ? 'primary' : 'outline'}
            >
               <Home size={24} className={`transition-colors duration-300 ${activeTab === 'upgrades' ? 'text-white' : 'text-neutral-300'}`} />
               <span className={`text-lg font-medium transition-colors duration-300 ${activeTab === 'upgrades' ? 'text-white' : 'text-neutral-300'}`}>{t('home')}</span>
            </Button>

            <Button
               onClick={() => setActiveTab('achievements')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'achievements' ? 'bg-neutral-700 text-white border-2 border-yellow-500' : 'text-neutral-300'}`}
               variant={activeTab === 'achievements' ? 'primary' : 'outline'}
            >
               <Star size={24} className={`transition-colors duration-300 ${activeTab === 'achievements' ? 'text-white' : 'text-neutral-300'}`} />
               <span className={`text-lg font-medium transition-colors duration-300 ${activeTab === 'achievements' ? 'text-white' : 'text-neutral-300'}`}>{t('achievements')}</span>
            </Button>

            <Button
               onClick={() => setActiveTab('settings')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'settings' ? 'bg-neutral-700 text-white border-2 border-green-500' : 'text-neutral-300'}`}
               variant={activeTab === 'settings' ? 'primary' : 'outline'}
            >
               <Cog size={24} className={`transition-colors duration-300 ${activeTab === 'settings' ? 'text-white' : 'text-neutral-300'}`} />
               <span className={`text-lg font-medium transition-colors duration-300 ${activeTab === 'settings' ? 'text-white' : 'text-neutral-300'}`}>{t('settings')}</span>
            </Button>
         </div>
      </div>
   );
};

export default Sidebar;