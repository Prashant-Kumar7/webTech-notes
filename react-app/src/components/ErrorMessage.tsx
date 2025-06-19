import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-2 bg-red-500/20 rounded-full">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-red-300">
          Something went wrong
        </h3>
      </div>
      
      <p className="text-red-200 mb-4">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};