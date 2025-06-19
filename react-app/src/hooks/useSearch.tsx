import { useState, useMemo } from 'react';
import type { Note } from '../types/Notes';

export const useSearch = (notes: Note[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = searchTerm === '' || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || 
        note.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [notes, searchTerm, selectedTag]);

  return {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    filteredNotes
  };
};