import React from 'react';
import Icon from '../AppIcon';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  indeterminate = false,
  size = 'default',
  id,
  name,
  value,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    default: 14,
    lg: 16
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          <div
            className={`
              ${sizeClasses[size]} border-2 rounded transition-all duration-150 cursor-pointer
              flex items-center justify-center
              ${disabled 
                ? 'opacity-50 cursor-not-allowed bg-muted border-border' :'hover:border-primary/50'
              }
              ${error 
                ? 'border-error' 
                : checked || indeterminate 
                  ? 'border-primary bg-primary' :'border-border bg-input'
              }
              ${checked || indeterminate ? 'text-white' : 'text-transparent'}
            `}
            onClick={() => !disabled && document.getElementById(id)?.click()}
          >
            {indeterminate ? (
              <Icon name="Minus" size={iconSizes[size]} />
            ) : checked ? (
              <Icon name="Check" size={iconSizes[size]} />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={id}
                className={`
                  block text-sm font-medium cursor-pointer
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${error ? 'text-error' : 'text-foreground'}
                `}
              >
                {label}
                {required && <span className="text-error ml-1">*</span>}
              </label>
            )}
            {description && !error && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error flex items-center space-x-1 ml-8">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

const CheckboxGroup = ({ 
  label, 
  description, 
  error, 
  required = false, 
  children, 
  className = "" 
}) => {
  return (
    <fieldset className={`space-y-4 ${className}`}>
      {label && (
        <legend className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </legend>
      )}
      
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="space-y-3">
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
};

export { Checkbox, CheckboxGroup };