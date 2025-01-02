"use client";

type FormSkeletonProps = {
  fields?: number;
};

export default function FormSkeleton({ fields = 6 }: FormSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(fields)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
        </div>
      ))}
      <div className="flex justify-end gap-3 mt-6">
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-24 bg-blue-200 dark:bg-blue-900 rounded"></div>
      </div>
    </div>
  );
}
