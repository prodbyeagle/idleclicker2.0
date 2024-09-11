import React from 'react';

/**
 * Button component with customizable styles and variants.
 *
 * @param {Object} props - The properties object.
 * @param {'primary' | 'outline'} [props.variant='outline'] - The button style variant. Options are 'primary' and 'outline'.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.activeClassName] - CSS classes to apply when the button is active.
 * @param {boolean} [props.active=false] - Whether the button is in an active state.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {...React.ButtonHTMLAttributes<HTMLButtonElement>} [props] - Any other properties to pass to the button element.
 */
const Button = ({ variant = 'outline', className, activeClassName, ...props }) => {
   const baseStyles = 'flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-250';
   const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-neutral-600'
   };

   return (
      <button
         className={`${baseStyles} ${variantStyles[variant]} ${className} ${props.disabled ? '' : ''} ${props.active ? activeClassName : ''}`}
         {...props}
      />
   );
};

export default Button;
