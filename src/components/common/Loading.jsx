import React from 'react';

const Loading = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false,
  type = 'spinner', // 'spinner', 'skeleton', or 'card'
  count = 1 // For card type, how many cards to show
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`inline-block animate-spin rounded-full border-t-2 border-b-2 border-green-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {message}
        </p>
      )}
    </div>
  );

  const skeleton = (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  // RecipeCard skeleton - matches both RecipeCard component and Recipes page layout
  const cardSkeleton = (
    <>
      {[...Array(count)].map((_, index) => (
        <div 
          key={index} 
          className="group block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
        >
          {/* Image skeleton - matches h-44 from RecipeCard component */}
          <div className="relative">
            <div className="h-44 w-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            {/* Favorite button skeleton */}
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
          </div>
          
          {/* Content skeleton - matches p-5 padding from RecipeCard */}
          <div className="p-5 flex flex-col gap-2">
            {/* Title skeleton - matches text-lg font-semibold */}
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
            {/* Description skeleton - matches text-sm */}
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mt-1 animate-pulse"></div>
            {/* View details link skeleton */}
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mt-2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </>
  );

  let content;
  if (type === 'spinner') {
    content = spinner;
  } else if (type === 'card') {
    content = cardSkeleton;
  } else {
    content = skeleton;
  }

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        {content}
      </div>
    );
  }

  // For card type, don't wrap in extra div (cards should be in grid)
  if (type === 'card') {
    return <>{content}</>;
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
};

export default Loading;

