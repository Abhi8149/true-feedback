import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
    </div>
  );
};

export default MessageSkeleton;