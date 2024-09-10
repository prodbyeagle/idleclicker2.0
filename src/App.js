import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IdleClicker from './components/IdleClicker';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Settings from './components/Settings';
import Upgrades from './components/Upgrades';

const App = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  // eslint-disable-next-line
  const [points, setPoints] = useState(0);
  // eslint-disable-next-line
  const [upgradesCount, setUpgradesCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false); // Track sidebar collapse

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {activeTab === 'home' && (
          <IdleClicker
            setPoints={setPoints}
            setUpgradesCount={setUpgradesCount}
          />
        )}
        {activeTab === 'upgrades' && !isUpgradeModalOpen && (
          <Upgrades />
        )}
        {activeTab === 'settings' && (
          <Settings />
        )}
        {activeTab === 'achievements' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-5xl font-semibold mb-6">{t('achievements')}</h2>
              <p className="text-2xl">{t('comingSoon')}</p>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)}>
        <h2 className="text-3xl font-semibold mb-6">{t('availableUpgrades')}</h2>
        <IdleClicker modalType="upgrades" />
      </Modal>
    </div>
  );
};

export default App;
