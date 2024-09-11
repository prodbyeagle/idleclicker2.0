import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Toast component displays a notification message.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.message - The message to display in the toast.
 * @param {'success' | 'error' | 'info' | 'warning'} props.type - The type of the toast which determines the styling.
 * @param {Function} props.onClose - Callback function to call when the toast is closed.
 */
const Toast = ({ message, type, onClose }) => {
   const [visible, setVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
   }, []);

   useEffect(() => {
      if (!visible) {
         onClose();
      }
   }, [visible, onClose]);

   const getToastClass = () => {
      switch (type) {
         case 'success':
            return 'bg-green-500 text-white';
         case 'error':
            return 'bg-red-500 text-white';
         case 'info':
            return 'bg-blue-500 text-white';
         case 'warning':
            return 'bg-yellow-500 text-black';
         default:
            return 'bg-gray-800 text-white';
      }
   };

   if (!visible) return null;

   return (
      <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${getToastClass()}`}>
         <p>{message}</p>
      </div>
   );
};

Toast.propTypes = {
   message: PropTypes.string.isRequired,
   type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
   onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
   type: 'info',
};

export default Toast;
