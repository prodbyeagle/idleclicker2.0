import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IdleClicker from './components/IdleClicker';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Settings from './components/Settings'; // Import the Settings component
import achievementsData from './data/achievements.json';
import { loadUserData, saveUserData } from './utils/userData';

const App = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upgrades');
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [points, setPoints] = useState(0);
  const [upgradesCount, setUpgradesCount] = useState(0);
  const [upgradesLevels, setUpgradesLevels] = useState({});
  const [settings, setSettings] = useState({ language: 'en' });

  // Load saved data from localStorage
  useEffect(() => {
    const { gameSave, settings } = loadUserData();
    setPoints(gameSave?.points || 0);
    setUpgradesCount(gameSave?.upgradesCount || 0);
    setUpgradesLevels(gameSave?.upgradesLevels || {});
    setSettings(settings || { language: 'en' });
  }, []);

  // Save data to localStorage
  useEffect(() => {
    saveUserData({
      gameSave: {
        points,
        upgradesCount,
        upgradesLevels,
      },
      settings
    });
  }, [points, upgradesCount, upgradesLevels, settings]);

  // Load achievements data when activeTab changes
  useEffect(() => {
    if (activeTab === 'achievements') {
      setAchievements(achievementsData.achievements);
    }
  }, [activeTab]);

  // Update achievements based on points and upgrades
  useEffect(() => {
    const updatedAchievements = achievements.map((achievement) => {
      if (!achievement.unlocked) {
        if (achievement.type === 'clicks' && points >= achievement.threshold) {
          return { ...achievement, unlocked: true };
        }
        if (achievement.type === 'upgrades' && upgradesCount >= achievement.threshold) {
          return { ...achievement, unlocked: true };
        }
        if (achievement.type === 'points' && points >= achievement.threshold) {
          return { ...achievement, unlocked: true };
        }
      }
      return achievement;
    });

    const sortedAchievements = updatedAchievements.sort((a, b) => {
      const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    setAchievements(sortedAchievements);
  }, [points, upgradesCount]);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setUpgradeModalOpen={setUpgradeModalOpen}
        setAchievementsModalOpen={setAchievementsModalOpen}
      />
      <div className="flex-1 p-8 ml-64">
        {activeTab === 'upgrades' && (
          <IdleClicker
            setPoints={setPoints}
            setUpgradesCount={setUpgradesCount}
            setUpgradesLevels={setUpgradesLevels}
          />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
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
                  <p className="text-lg mb-2">{t('unlocked')}: {achievement.unlocked ? t('yes') : t('no')}</p>
                </div>
              ))
            ) : (
              <p className="text-lg">{t('noAchievements')}</p>
            )}
          </div>
        )}
      </div>

      {/* Modals in App.js */}
      <Modal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)}>
        <h2 className="text-3xl font-semibold mb-6">{t('availableUpgrades')}</h2>
        <IdleClicker modalType="upgrades" />
      </Modal>

      <Modal isOpen={isAchievementsModalOpen} onClose={() => setAchievementsModalOpen(false)}>
        <h2 className="text-3xl font-semibold mb-6">{t('achievements')}</h2>
        <div className="space-y-4">
          {/* Placeholder for achievements content */}
          <p className="text-lg">{t('noAchievements')}</p>
        </div>
      </Modal>
    </div>
  );
};

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common':
      return '#4CAF50'; // Green
    case 'rare':
      return '#2196F3'; // Blue
    case 'epic':
      return '#9C27B0'; // Purple
    case 'legendary':
      return '#F44336'; // Red
    default:
      return '#9E9E9E'; // Default Gray
  }
};

export default App;