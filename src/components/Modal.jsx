import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
   const [show, setShow] = useState(false);

   useEffect(() => {
      if (isOpen) {
         setShow(true);
      } else {
         const timer = setTimeout(() => setShow(false), 400); // Längere Fade-Out Dauer
         return () => clearTimeout(timer);
      }
   }, [isOpen]);

   if (!show && !isOpen) return null;

   return (
      <div
         className={`fixed inset-0 flex justify-center items-center backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${isOpen ? 'opacity-100' : 'opacity-0'}`}
         style={{ transitionDelay: isOpen ? '0s' : '0.2s' }} // Verzögerung beim Schließen
         onClick={onClose} // Klick auf den Hintergrund schließt das Modal
      >
         <div
            className={`bg-neutral-800/70 text-neutral-200 p-6 rounded-lg transition-all transform duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'} `}
            style={{ backfaceVisibility: 'hidden' }} // Optimierte Animation
            onClick={(e) => e.stopPropagation()} // Verhindert das Schließen des Modals, wenn im Modal geklickt wird
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