import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
   const [show, setShow] = useState(false);

   useEffect(() => {
      if (isOpen) {
         setShow(true);
      } else {
         const timer = setTimeout(() => setShow(false), 300); // Fade-Out-Dauer
         return () => clearTimeout(timer);
      }
   }, [isOpen]);

   if (!show && !isOpen) return null;

   return (
      <div
         className={`fixed inset-0 flex justify-center items-center backdrop-blur-xl transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
         <div
            className={`bg-neutral-800/70 text-neutral-200 p-6 rounded-lg transition-opacity transform duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
         >
            {children}
            <button
               className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
               onClick={onClose}
            >
               Schließen
            </button>
         </div>
      </div>
   );
};

export default Modal;