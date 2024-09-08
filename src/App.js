import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IdleClicker from './components/IdleClicker';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Settings from './components/Settings';
import Upgrades from './components/Upgrades';
import achievementsData from './data/achievements.json';

const App = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  // eslint-disable-next-line
  const [points, setPoints] = useState(0);
  // eslint-disable-next-line
  const [upgradesCount, setUpgradesCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false); // Track sidebar collapse

  useEffect(() => {
    if (activeTab === 'achievements') {
      setAchievements(achievementsData.achievements);
    }
  }, [activeTab]);

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
        {activeTab === 'upgrades' && (
          <Upgrades />
        )}
        {activeTab === 'settings' && (
          <Settings />
        )}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold mb-6">{t('achievements')}</h2>
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-neutral-800 p-4 rounded-lg shadow-md border-l-4"
                  style={{ borderColor: getRarityColor(achievement.rarity) }}
                >
                  <h3 className="text-xl font-bold mb-2">{t(`achievement_${achievement.id}_name`)}</h3>
                  <p className="text-lg mb-2">{t('description')}: {t(`achievement_${achievement.id}_description`)}</p>
                  <p className="text-lg mb-2">{t('reward')}: {achievement.reward}</p>
                  <p className="text-lg mb-2">{t('unlocked')}: {achievement.unlocked ? t('✅') : t('❌')}</p>
                </div>
              ))
            ) : (
              <p className="text-lg">{t('noAchievements')}</p>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)}>
        <h2 className="text-3xl font-semibold mb-6">{t('availableUpgrades')}</h2>
        <IdleClicker modalType="upgrades" />
      </Modal>

      <Modal isOpen={isAchievementsModalOpen} onClose={() => setAchievementsModalOpen(false)}>
        <h2 className="text-3xl font-semibold mb-6">{t('achievements')}</h2>
        <div className="space-y-4">
          <p className="text-lg">{t('noAchievements')}</p>
        </div>
      </Modal>
    </div>
  );
};

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common':
      return '#4CAF50';
    case 'rare':
      return '#2196F3';
    case 'epic':
      return '#9C27B0';
    case 'legendary':
      return '#ffd700';
    default:
      return '#9E9E9E';
  }
};

export default App;