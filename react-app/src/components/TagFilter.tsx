import { useState, useRef, useEffect } from 'react';
import { Tag, ChevronDown, Check } from 'lucide-react';

interface TagFilterProps {
  selectedTag: string;
  availableTags: string[];
  onTagChange: (tag: string) => void;
}

export default function TagFilter({ selectedTag, availableTags, onTagChange }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagSelect = (tag: string) => {
    onTagChange(tag);
    setIsOpen(false);
  };

  const displayText = selectedTag ? `#${selectedTag}` : 'All Categories';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 min-w-[200px] text-gray-100 hover:bg-gradient-to-r hover:from-gray-700/90 hover:to-gray-600/90 hover:border-gray-500/70 hover:shadow-lg hover:shadow-blue-500/10"
      >
        <Tag 
          size={18} 
          className={`${selectedTag ? 'text-blue-400' : 'text-gray-400'} transition-colors duration-300 group-hover:text-blue-400`}
        />
        
        <span className="flex-1 text-left font-medium text-sm">
          {displayText}
        </span>
        
        <ChevronDown 
          size={18} 
          className={`text-gray-400 group-hover:text-blue-400 transition-all duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden transition-all duration-300 ${
        isOpen 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}>
        
        {/* All Categories Option */}
        <button
          onClick={() => handleTagSelect('')}
          className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-200 group ${
            !selectedTag ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300' : 'text-gray-300'
          }`}
        >
          <span className="font-medium text-sm">All Categories</span>
          {!selectedTag && (
            <Check size={16} className="text-blue-400" />
          )}
        </button>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mx-2" />

        {/* Tag Options */}
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-200 group ${
                selectedTag === tag ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300' : 'text-gray-300'
              }`}
            >
              <span className="font-medium text-sm">#{tag}</span>
              {selectedTag === tag && (
                <Check size={16} className="text-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}