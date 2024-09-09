import React from 'react';

const Checkbox = ({ checked, onChange, label, disabled }) => {
   return (
      <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-neutral-100'}`}>
         <input
            type="checkbox"
            checked={checked}
            onChange={disabled ? undefined : onChange}
            className="hidden"
            disabled={disabled}
         />
         <span
            className={`flex items-center justify-center w-6 h-6 border rounded mr-3 transition-colors duration-200 ${disabled ? 'bg-neutral-700 border-neutral-500' : (checked ? 'bg-green-500 border-green-500' : 'bg-neutral-800 border-neutral-600')
               }`}
         >
            {checked && !disabled && (
               <svg
                  className="w-4 h-4 text-neutral-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M5 13l4 4L19 7"
                  />
               </svg>
            )}
         </span>
         <span className={`text-lg ${disabled ? 'text-neutral-500' : ''}`}>{label}</span>
      </label>
   );
};

export default Checkbox;