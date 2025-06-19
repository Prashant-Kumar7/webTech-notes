import React, { useState, useRef, useEffect } from 'react';
import { Tag, X, Plus } from 'lucide-react';

interface TagAutocompleteProps {
  tags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TagAutocomplete: React.FC<TagAutocompleteProps> = ({
  tags,
  availableTags,
  onTagsChange,
  placeholder = "Add a tag...",
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input and exclude already selected tags
  const suggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(inputValue.toLowerCase()) && 
    !tags.includes(tag)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue('');
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(value.length > 0);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        addTag(suggestions[focusedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className={`flex flex-wrap gap-2 p-3 border border-gray-600 rounded-xl bg-gray-700/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}>
        {/* Selected Tags */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700/50 hover:bg-blue-900/70 transition-colors duration-200"
          >
            <Tag size={12} />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              disabled={disabled}
              className="ml-1 text-blue-400 hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-blue-800/50 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        
        {/* Input */}
        <div className="flex-1 min-w-[120px] relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => !disabled && inputValue && setIsOpen(true)}
            disabled={disabled}
            className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
            placeholder={tags.length === 0 ? placeholder : ""}
          />
        </div>
        
        {/* Add Button */}
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm"
          >
            <Plus size={12} />
            Add
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-lg shadow-2xl shadow-black/50 z-50 max-h-48 overflow-y-auto">
          {suggestions.map((tag, index) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-blue-500/20 transition-colors duration-200 ${
                index === focusedIndex ? 'bg-blue-500/20 text-blue-300' : 'text-gray-300'
              }`}
            >
              <Tag size={14} />
              <span className="font-medium">#{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};