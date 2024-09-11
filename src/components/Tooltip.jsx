import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props - The properties object.
 * @param {string} props.content - The text content to display in the tooltip.
 * @param {React.ReactNode} props.children - The element(s) that the tooltip is attached to.
 * @param {'top' | 'bottom' | 'left' | 'right'} [props.position='bottom'] - The position of the tooltip relative to the target element.
 * @param {number} [props.delay=300] - The delay in milliseconds before the tooltip appears.
 */
const Tooltip = ({ content, children, position = 'bottom', delay = 300 }) => {
   const [isVisible, setIsVisible] = useState(false);
   const [timeoutId, setTimeoutId] = useState(null);
   const tooltipRef = useRef(null);
   const targetRef = useRef(null);

   const showTooltip = () => {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
   };

   const hideTooltip = () => {
      if (timeoutId) {
         clearTimeout(timeoutId);
      }
      setIsVisible(false);
   };

   return (
      <div
         className="relative inline-block"
         onMouseEnter={showTooltip}
         onMouseLeave={hideTooltip}
         ref={targetRef}
      >
         <div
            ref={tooltipRef}
            className={`absolute z-10 px-2 py-1 bg-neutral-700 border border-neutral-600 text-white text-sm rounded-md whitespace-nowrap transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${position === 'bottom'
               ? 'top-full mt-2 left-1/2 transform -translate-x-1/2'
               : position === 'top'
                  ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                  : position === 'left'
                     ? 'right-full mr-2 top-1/2 transform -translate-y-1/2'
                     : 'left-full ml-2 top-1/2 transform -translate-y-1/2'
               }`}
            style={{ pointerEvents: 'none' }}
         >
            {content}
         </div>
         {children}
      </div>
   );
};

Tooltip.propTypes = {
   content: PropTypes.string.isRequired,
   children: PropTypes.node.isRequired,
   position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
   delay: PropTypes.number,
};

export default Tooltip;