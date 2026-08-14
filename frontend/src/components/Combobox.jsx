import React, { useState, useEffect, useRef } from 'react';

const Combobox = ({ label, placeholder, options = [], value, onChange, zIndex = 1 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Sync internal search input text with external value prop
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Handle clicking outside to close dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on typed input
  const filteredOptions = options.filter(opt => {
    const optLabel = typeof opt === 'string' ? opt : (opt.label || opt.name || opt.value || '');
    return optLabel.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  const handleSelectOption = (opt) => {
    const optVal = typeof opt === 'string' ? opt : (opt.label || opt.name || opt.value || opt.id || '');
    onChange(optVal, opt);
    setSearchTerm(optVal);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val, null);
    setIsOpen(true);
  };

  return (
    <div 
      className="space-y-1 relative" 
      ref={wrapperRef}
      style={{ zIndex: isOpen ? (zIndex + 50) : zIndex }}
    >
      {label && <label className="text-sm font-semibold text-on-surface-variant block mb-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white dark:bg-surface-container-highest border border-outline-variant rounded-xl py-3 pl-4 pr-10 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium shadow-sm placeholder:text-on-surface-variant/50"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] block">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-1 z-[9999]"
          style={{ isolation: 'isolate' }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const optText = typeof opt === 'string' ? opt : (opt.label || opt.name || opt.value || '');
              const isSelected = searchTerm && optText.toLowerCase() === searchTerm.toLowerCase();
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`px-4 py-3 hover:bg-primary/10 cursor-pointer text-on-surface text-sm flex items-center justify-between transition-colors font-medium border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${isSelected ? 'bg-primary/10 text-primary font-bold' : ''}`}
                >
                  <span>{optText}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-sm text-on-surface-variant flex flex-col gap-1 bg-white dark:bg-gray-800">
              <span className="text-xs text-on-surface-variant/70">No matching preset found.</span>
              {searchTerm && (
                <div 
                  onClick={() => handleSelectOption(searchTerm)}
                  className="text-primary font-bold cursor-pointer hover:underline flex items-center gap-1.5 mt-1 pt-1 border-t border-gray-100"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Use custom value: "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;
