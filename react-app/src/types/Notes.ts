export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface EditNoteData extends NoteFormData {
  id: string;
}