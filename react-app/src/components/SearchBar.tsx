import React from 'react';
import { Search, X } from 'lucide-react';
import TagFilter from './TagFilter';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  availableTags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedTag,
  onTagChange,
  availableTags
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-gray-100 placeholder-gray-400"
          />
        </div>
        
        <TagFilter
            selectedTag={selectedTag}
            availableTags={availableTags}
            onTagChange={onTagChange}
        />
        
        {(searchTerm || selectedTag) && (
          <button
            onClick={() => {
              onSearchChange('');
              onTagChange('');
            }}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center gap-2 text-gray-300 hover:text-gray-100"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};