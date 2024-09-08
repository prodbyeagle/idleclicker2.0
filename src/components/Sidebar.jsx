import React, { useState, useEffect } from 'react';
import { Home, Gift, Cog, CircleArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const Sidebar = ({ activeTab, setActiveTab }) => {
   const { t } = useTranslation();
   const [isCollapsed, setIsCollapsed] = useState(false);

   // Detect screen size and toggle collapse for mobile
   useEffect(() => {
      const handleResize = () => {
         setIsCollapsed(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Trigger on mount

      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return (
      <div className={`bg-neutral-800 p-4 flex flex-col h-full fixed top-0 left-0 transition-width duration-300 ${isCollapsed ? 'w-22' : 'w-64'}`}>
         {/* Sidebar Header */}
         <div className="mb-6 flex items-center space-x-2">
            <Home size={32} className="text-neutral-400" />
            {!isCollapsed && <span className="text-neutral-100 text-2xl font-semibold">Menu</span>}
         </div>

         {/* Navigation Buttons */}
         <div className="flex flex-col space-y-2 flex-grow">
            <Button
               onClick={() => setActiveTab('home')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'home' ? 'bg-neutral-700 text-white border-2 border-blue-500' : 'text-neutral-300'}`}
               variant={activeTab === 'home' ? 'primary' : 'outline'}
            >
               <Home size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('home')}</span>}
            </Button>

            <Button
               onClick={() => setActiveTab('upgrades')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'upgrades' ? 'bg-neutral-700 text-white border-2 border-blue-500' : 'text-neutral-300'}`}
               variant={activeTab === 'upgrades' ? 'primary' : 'outline'}
            >
               <CircleArrowUp size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('upgrades')}</span>}
            </Button>

            <Button
               onClick={() => setActiveTab('achievements')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'achievements' ? 'bg-neutral-700 text-white border-2 border-yellow-500' : 'text-neutral-300'}`}
               variant={activeTab === 'achievements' ? 'primary' : 'outline'}
            >
               <Gift size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('achievements')}</span>}
            </Button>

            <Button
               onClick={() => setActiveTab('settings')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'settings' ? 'bg-neutral-700 text-white border-2 border-green-500' : 'text-neutral-300'}`}
               variant={activeTab === 'settings' ? 'primary' : 'outline'}
            >
               <Cog size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('settings')}</span>}
            </Button>
         </div>
      </div>
   );
};

export default Sidebar;
