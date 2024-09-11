import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/modal.css'; // Import the CSS file

/**
 * Modal component represents a modal dialog that displays content and can be opened or closed.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Boolean indicating if the modal is open.
 * @param {Function} props.onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} props.children - Content to be displayed inside the modal.
 *
 * @component
 */
const Modal = ({ isOpen, onClose, children }) => {
   const { t } = useTranslation();

   useEffect(() => {
      if (!isOpen) {
         const timer = setTimeout(() => onClose(), 500);
         return () => clearTimeout(timer);
      }
   }, [isOpen, onClose]);

   return (
      <div
         className={`modal-overlay ${isOpen ? 'open' : ''}`}
         onClick={onClose}
      >
         <div
            className={`modal-content ${!isOpen ? 'hidden' : ''}`}
            onClick={(e) => e.stopPropagation()}
         >
            {children}
            <button
               className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
               onClick={onClose}
            >
               {t('close')}
            </button>
         </div>
      </div>
   );
};

export default Modal;
