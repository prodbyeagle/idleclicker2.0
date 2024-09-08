import React from 'react';

const Button = ({ variant = 'outline', className, activeClassName, ...props }) => {
   const baseStyles = 'flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-250 cursor-pointer';
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
