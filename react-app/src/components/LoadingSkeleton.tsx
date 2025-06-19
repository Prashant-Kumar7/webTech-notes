import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 animate-pulse"
        >
          {/* Title skeleton */}
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-700/50 rounded-lg flex-1 mr-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-700/50 rounded"></div>
              <div className="w-5 h-5 bg-gray-700/50 rounded"></div>
              <div className="w-5 h-5 bg-gray-700/50 rounded"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-3/6"></div>
          </div>
          
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 bg-gray-700/50 rounded-full w-16"></div>
            <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
            <div className="h-6 bg-gray-700/50 rounded-full w-12"></div>
          </div>
          
          {/* Date skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-700/50 rounded w-32"></div>
            <div className="h-3 bg-gray-700/50 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SearchBarSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 mb-8 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-gray-700/50 rounded-lg"></div>
        <div className="w-48 h-12 bg-gray-700/50 rounded-lg"></div>
        <div className="w-20 h-12 bg-gray-700/50 rounded-lg"></div>
      </div>
    </div>
  );
};