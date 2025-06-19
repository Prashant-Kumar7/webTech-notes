import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-100 mb-3 border-b border-gray-600 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-200 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-gray-200 mb-2">
              {children}
            </h3>
          ),
          // Customize paragraph styles
          p: ({ children }) => (
            <p className="text-gray-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),
          // Customize list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">
              {children}
            </li>
          ),
          // Customize code styles
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-700/50 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-800/50 text-gray-200 p-3 rounded-lg text-sm font-mono overflow-x-auto border border-gray-600/30">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 mb-3 overflow-x-auto">
              {children}
            </pre>
          ),
          // Customize blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/50 pl-4 py-2 bg-gray-800/30 text-gray-300 italic mb-3 rounded-r-lg">
              {children}
            </blockquote>
          ),
          // Customize link styles
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Customize table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gray-600/50 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-700/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-gray-200 font-medium border-b border-gray-600/50">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-300 border-b border-gray-700/30">
              {children}
            </td>
          ),
          // Customize horizontal rule
          hr: () => (
            <hr className="border-gray-600/50 my-4" />
          ),
          // Customize strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-100">
              {children}
            </strong>
          ),
          // Customize emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-gray-200">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};