import React, { useState, useEffect } from 'react';
import { Home, Gift, Cog, CircleArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

/**
 * Sidebar component provides navigation links and options in the application.
 *
 * @param {Object} props - The component props.
 * @param {string} props.activeTab - The currently active tab.
 * @param {Function} props.setActiveTab - Function to set the active tab.
 *
 * @component
 */
const Sidebar = ({ activeTab, setActiveTab }) => {
   const { t } = useTranslation();
   const [isCollapsed, setIsCollapsed] = useState(false);

   useEffect(() => {
      /**
       * Handles window resize to collapse or expand the sidebar based on width.
       */
      const handleResize = () => {
         setIsCollapsed(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return (
      <div
         className={`bg-neutral-800 p-4 flex flex-col h-full fixed top-0 left-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}
      >
         {/* Sidebar Header */}
         <div
            className={`mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-8'} transition-all rounded hover:bg-neutral-900 duration-300 ease-in-out`}
         >
            <Home size={32} className="text-neutral-400 hover:bg-neutral-900 transition-all duration-200 rounded p-1" />
            {!isCollapsed && <span className="text-neutral-100 text-2xl font-semibold">Menu</span>}
         </div>

         {/* Navigation Buttons */}
         <div className="flex flex-col space-y-2 flex-grow">
            <Button
               onClick={() => setActiveTab('home')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'home' ? 'bg-blue-700/40 text-white border-2 border-blue-500' : 'text-neutral-300'}`}
               variant={activeTab === 'home' ? 'primary' : 'outline'}
            >
               <Home size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('home')}</span>}
            </Button>

            <Button
               onClick={() => setActiveTab('upgrades')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'upgrades' ? 'bg-green-700/40 hover:bg-green-700/70 text-white border-2 border-green-500' : 'text-neutral-300'}`}
               variant={activeTab === 'upgrades' ? 'primary' : 'outline'}
            >
               <CircleArrowUp size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('upgrades')}</span>}
            </Button>

            <Button
               onClick={() => setActiveTab('achievements')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'achievements' ? 'bg-yellow-700/40 hover:bg-yellow-700/70 text-white border-2 border-yellow-500' : 'text-neutral-300'}`}
               variant={activeTab === 'achievements' ? 'primary' : 'outline'}
            >
               <Gift size={24} className="text-neutral-300" />
               {!isCollapsed && <span className="text-lg font-medium">{t('achievements')}</span>}
            </Button>

            <Button
               onClick={() => setActiveTab('settings')}
               className={`flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'settings' ? 'bg-gray-700/40 hover:bg-gray-700/70 text-white border-2 border-gray-500' : 'text-neutral-300'}`}
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