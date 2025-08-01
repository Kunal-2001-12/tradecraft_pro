import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  description,
  error,
  disabled = false,
  required = false,
  loading = false,
  multiple = false,
  searchable = false,
  clearable = false,
  id,
  name,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get display value
  const getDisplayValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option ? option.label : placeholder;
      }
      return `${value.length} selected`;
    } else {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : placeholder;
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    if (multiple) {
      const newValue = value || [];
      const isSelected = newValue.includes(optionValue);
      const updatedValue = isSelected
        ? newValue.filter(v => v !== optionValue)
        : [...newValue, optionValue];
      onChange(updatedValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const hasValue = multiple ? value && value.length > 0 : value;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          id={id}
          name={name}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            relative w-full px-3 py-2 text-left bg-input border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-colors duration-150
            ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-border'}
            ${error ? 'border-error' : 'border-border'}
            ${isOpen ? 'ring-2 ring-ring border-transparent' : ''}
          `}
        >
          <span className={`block truncate ${!hasValue ? 'text-muted-foreground' : 'text-foreground'}`}>
            {loading ? 'Loading...' : getDisplayValue()}
          </span>
          
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {clearable && hasValue && !disabled && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded transition-colors duration-150"
              >
                <Icon name="X" size={14} className="text-muted-foreground" />
              </button>
            )}
            <Icon 
              name={loading ? "Loader2" : "ChevronDown"} 
              size={16} 
              className={`text-muted-foreground transition-transform duration-150 ${
                loading ? 'animate-spin' : isOpen ? 'rotate-180' : ''
              }`} 
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple 
                    ? value && value.includes(option.value)
                    : value === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !option.disabled && handleOptionSelect(option.value)}
                      disabled={option.disabled}
                      className={`
                        w-full px-3 py-2 text-left text-sm transition-colors duration-150
                        ${option.disabled 
                          ? 'opacity-50 cursor-not-allowed' :'hover:bg-muted cursor-pointer'
                        }
                        ${isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {multiple && isSelected && (
                          <Icon name="Check" size={16} className="text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Select;