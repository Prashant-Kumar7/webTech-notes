import { useState, useEffect } from 'react';
import type { Note, NoteFormData, EditNoteData } from '../types/Notes';
import { notesApi, type ApiNote } from '../service/api';

// Convert API note to local Note type
const convertApiNoteToNote = (apiNote: ApiNote): Note => ({
  ...apiNote,
  createdAt: new Date(apiNote.createdAt),
  updatedAt: new Date(apiNote.updatedAt || apiNote.createdAt)
});

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    add: boolean;
    edit: boolean;
    delete: boolean;
  }>({
    add: false,
    edit: false,
    delete: false
  });

  // Load notes and tags on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [notesData, tagsData] = await Promise.all([
          notesApi.getAllNotes(),
          notesApi.getAllTags()
        ]);
        
        setNotes(notesData.map(convertApiNoteToNote));
        setTags(tagsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addNote = async (noteData: NoteFormData) => {
    try {
      setActionLoading(prev => ({ ...prev, add: true }));
      setError(null);
      
      const newNote = await notesApi.createNote(noteData);
      const convertedNote = convertApiNoteToNote(newNote);
      
      setNotes(prev => [convertedNote, ...prev]);
      
      // Update tags if new ones were added
      const newTags = noteData.tags.filter(tag => !tags.includes(tag));
      if (newTags.length > 0) {
        setTags(prev => [...prev, ...newTags].sort());
      }
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err instanceof Error ? err.message : 'Failed to add note');
      throw err; // Re-throw to allow component to handle it
    } finally {
      setActionLoading(prev => ({ ...prev, add: false }));
    }
  };

  const editNote = async (editData: EditNoteData) => {
    try {
      setActionLoading(prev => ({ ...prev, edit: true }));
      setError(null);
      
      const updatedNote = await notesApi.updateNote(editData.id, {
        title: editData.title,
        content: editData.content,
        tags: editData.tags
      });
      
      const convertedNote = convertApiNoteToNote(updatedNote);
      
      setNotes(prev => prev.map(note => 
        note.id === editData.id ? convertedNote : note
      ));
      
      // Update tags if new ones were added
      const newTags = editData.tags.filter(tag => !tags.includes(tag));
      if (newTags.length > 0) {
        setTags(prev => [...prev, ...newTags].sort());
      }
    } catch (err) {
      console.error('Error editing note:', err);
      setError(err instanceof Error ? err.message : 'Failed to edit note');
      throw err; // Re-throw to allow component to handle it
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setActionLoading(prev => ({ ...prev, delete: true }));
      setError(null);
      
      await notesApi.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      
      // Refresh tags after deletion
      const updatedTags = await notesApi.getAllTags();
      setTags(updatedTags);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err; // Re-throw to allow component to handle it
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const getAllTags = () => tags;

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [notesData, tagsData] = await Promise.all([
        notesApi.getAllNotes(),
        notesApi.getAllTags()
      ]);
      
      setNotes(notesData.map(convertApiNoteToNote));
      setTags(tagsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return {
    notes,
    loading,
    error,
    actionLoading,
    addNote,
    editNote,
    deleteNote,
    getAllTags,
    refreshData
  };
};