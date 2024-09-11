import { useEffect, useRef } from 'react';
import { debugLog } from '../utils/debug';  // Import the debugLog function

/**
 * 
 * @param {Object} autoClickerUpgrade - The upgrade object for the auto-clicker. 
 *                                      Contains at least a 'level' property to determine the speed of auto-clicks.
 *                                      If this is null or level is 0, auto-clicking is disabled.
 * @param {Function} addPoints - Function to add points to the user's total points. It will be called
 *                               with the amount of points earned by the auto-clicker.
 * 
 */
const useAutoClicker = (autoClickerUpgrade, addPoints, isAutoClickerActive) => {
   const autoClickInterval = useRef(null);

   useEffect(() => {
      if (!autoClickerUpgrade || autoClickerUpgrade.level === 0 || !isAutoClickerActive) {
         debugLog('useAutoClicker', 'Auto-clicker disabled');
         return;
      }

      const intervalDuration = Math.max(1000 - (autoClickerUpgrade.level * 200), 500);
      debugLog('useAutoClicker', `Auto-clicker activated with interval: ${intervalDuration}ms and level: ${autoClickerUpgrade.level}`);

      if (autoClickInterval.current) {
         clearInterval(autoClickInterval.current);
         debugLog('useAutoClicker', 'Cleared previous auto-clicker interval');
      }

      autoClickInterval.current = setInterval(() => {
         const pointsEarned = 10 * autoClickerUpgrade.level;
         debugLog('useAutoClicker', `Auto-clicker earned ${pointsEarned} points`);
         addPoints(pointsEarned);
      }, intervalDuration);

      return () => {
         if (autoClickInterval.current) {
            clearInterval(autoClickInterval.current);
            debugLog('useAutoClicker', 'Auto-clicker interval cleared on cleanup');
         }
      };
   }, [autoClickerUpgrade, addPoints, isAutoClickerActive]);
};

export default useAutoClicker;