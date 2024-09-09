import React from 'react';

const ToggleSwitch = ({ checked, onChange, label, disabled }) => {
   return (
      <label
         className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-neutral-100'}`}
      >
         <input
            type="checkbox"
            checked={checked}
            onChange={disabled ? undefined : onChange}
            className="hidden"
            disabled={disabled}
         />
         <span
            className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${disabled ? 'bg-neutral-700' : checked ? 'bg-green-500' : 'bg-neutral-600'}`}
         >
            <span
               className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}
            ></span>
         </span>
         <span className={`ml-3 text-lg ${disabled ? 'text-neutral-500' : ''}`}>{label}</span>
      </label>
   );
};

export default ToggleSwitch;