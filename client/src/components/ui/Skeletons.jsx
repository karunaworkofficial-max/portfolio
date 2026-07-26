import React from 'react';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-text/10 rounded ${className}`} />
);

export const ProjectCardSkeleton = () => (
  <div className="bg-surface/50 border border-text/20 rounded-custom overflow-hidden">
    <Skeleton className="w-full aspect-[4/3] rounded-none" />
    <div className="p-4 border-t border-text/20">
      <Skeleton className="w-16 h-3 mb-3 rounded-full" />
      <Skeleton className="w-3/4 h-5" />
    </div>
  </div>
);

export const ProjectDetailSkeleton = () => (
  <div>
    <Skeleton className="w-full h-[60vh] rounded-none" />
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Skeleton className="w-32 h-4 mb-4 rounded-full" />
      <Skeleton className="w-3/4 h-12 mb-8" />
      <div className="flex flex-col md:flex-row gap-8 border-t border-text/20 pt-8">
        <div className="flex-1">
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-3/4 h-4" />
        </div>
        <div className="w-full md:w-1/3">
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 p-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-custom" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-96 rounded-custom" />
      <Skeleton className="h-96 rounded-custom" />
    </div>
  </div>
);

export const MessageListSkeleton = () => (
  <div className="space-y-4 p-4">
    {[1,2,3,4,5].map(i => (
      <div key={i} className="flex gap-4 p-4 border border-text/20 rounded">
        <Skeleton className="w-6 h-6 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-full h-3" />
        </div>
      </div>
    ))}
  </div>
);
