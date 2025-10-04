import React from "react";

const Input = ({
  children,
  type,
  placeholder,
  value,
  onChange,
  customClass,
  step = 1,
  min = 0,
  max,
}) => {
  if (children) throw new Error("'Input' component cannot receive children");

  const handleKeyDown = (e) => {
    // Handle Enter key to focus next input
    if (e.key === "Enter") {
      e.preventDefault();
      
      // Find all input elements in the form
      const form = e.target.closest('form');
      if (form) {
        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        const currentIndex = inputs.indexOf(e.target);
        
        // Find next focusable input
        for (let i = currentIndex + 1; i < inputs.length; i++) {
          const nextInput = inputs[i];
          if (!nextInput.disabled && nextInput.type !== 'hidden') {
            nextInput.focus();
            break;
          }
        }
      }
    }
    
    // Detect arrow key usage on number inputs
    if (type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      // Mark this as spinner input for the next change event
      e.target.dataset.inputMethod = 'spinner';
      
      // If field is empty, set default value immediately
      if (!value || value === '') {
        e.preventDefault(); // Prevent default arrow behavior
        
        // Trigger onChange with default value based on field ID
        const defaultValues = {
          'age': '35',
          'gross_salary': '8000',
          'work_start_year': '2010',
          'work_end_year': '2045',
          'zus_account_balance': '50000',
          'zus_subaccount_balance': '15000',
          'sick_leave_days_per_year': '5'
        };
        
        const defaultValue = defaultValues[id];
        if (defaultValue) {
          const syntheticEvent = {
            target: { value: defaultValue },
            inputMethod: 'spinner'
          };
          onChange(syntheticEvent);
        }
      }
    }
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-0 focus:ring-(--color-zus-green) focus:border-transparent transition-all duration-200 ${customClass}`}
      step={step}
      min={min}
      max={max}
    />
  );
};

export default Input;
