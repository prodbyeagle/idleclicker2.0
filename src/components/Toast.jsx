import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ message, type, onClose }) => {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      setVisible(true);

      const fadeOutTimer = setTimeout(() => {
         setVisible(false);
      }, 3000); // Duration the toast is visible

      const removeTimer = setTimeout(() => {
         onClose();
      }, 3300); // Duration of fade-out animation + visible time

      return () => {
         clearTimeout(fadeOutTimer);
         clearTimeout(removeTimer);
      };
   }, [message, onClose]);

   const getToastStyle = () => {
      switch (type) {
         case 'error':
            return 'bg-red-600';
         case 'info':
            return 'bg-blue-600';
         case 'success':
            return 'bg-green-600';
         default:
            return 'bg-neutral-900';
      }
   };

   return (
      <div
         className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white p-3 rounded-lg shadow-md transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} ${getToastStyle()}`}
      >
         {message}
      </div>
   );
};

Toast.propTypes = {
   message: PropTypes.string.isRequired,
   type: PropTypes.oneOf(['error', 'info', 'success']),
   onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
   type: 'info',
};

export default Toast;