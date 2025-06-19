import React, { useState } from 'react';
import { Trash2, Calendar, Tag, Edit3, Eye, EyeOff } from 'lucide-react';
import type { Note } from '../types/Notes';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit }) => {
  const [showMarkdown, setShowMarkdown] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(note.id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    onEdit(note);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasMarkdownSyntax = (content: string) => {
    const markdownPatterns = [
      /^#{1,6}\s/m,     // Headers
      /\*\*.*\*\*/,     // Bold
      /\*.*\*/,         // Italic
      /`.*`/,           // Inline code
      /```[\s\S]*```/,  // Code blocks
      /^\s*[-*+]\s/m,   // Lists
      /^\s*\d+\.\s/m,   // Numbered lists
      /\[.*\]\(.*\)/,   // Links
      /^\s*>/m,         // Blockquotes
    ];
    
    return markdownPatterns.some(pattern => pattern.test(content));
  };

  const shouldShowMarkdownToggle = hasMarkdownSyntax(note.content);

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group hover:border-gray-600/50">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-100 group-hover:text-blue-400 transition-colors duration-200 flex-1 mr-4">
            {note.title}
          </h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {shouldShowMarkdownToggle && (
              <button
                onClick={() => setShowMarkdown(!showMarkdown)}
                className="text-gray-500 hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-900/20"
                title={showMarkdown ? "Show raw text" : "Show markdown"}
              >
                {showMarkdown ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            <button
              onClick={handleEdit}
              className="text-gray-500 hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-900/20"
              title="Edit note"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-gray-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-lg hover:bg-red-900/20"
              title="Delete note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="mb-4 max-h-48 overflow-y-auto">
          {showMarkdown && shouldShowMarkdownToggle ? (
            <MarkdownRenderer content={note.content} />
          ) : (
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          )}
        </div>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700/50 hover:bg-blue-900/70 transition-colors duration-200"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>Created {formatDate(note.createdAt)}</span>
          </div>
          {note.updatedAt.getTime() !== note.createdAt.getTime() && (
            <span className="text-xs text-gray-600">
              Updated {formatDate(note.updatedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        noteTitle={note.title}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};