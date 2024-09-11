import React from 'react';

/**
 * Checkbox component that can be used to toggle a boolean state with an optional label.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.checked - Indicates whether the checkbox is checked.
 * @param {function} [props.onChange] - Callback function to handle changes when the checkbox is toggled. Ignored if `disabled` is true.
 * @param {string} [props.label] - The label text to display next to the checkbox.
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled.
 */
const Checkbox = ({ checked, onChange, label, disabled }) => {
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
            className={`flex items-center justify-center w-6 h-6 border rounded mr-3 transition-colors duration-200 ${disabled ? 'bg-neutral-700 border-neutral-500 cursor-default' : (checked ? 'bg-green-500 border-green-500' : 'bg-neutral-800 border-neutral-600')}`}
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