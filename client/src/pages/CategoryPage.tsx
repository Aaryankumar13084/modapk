import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { AppCard } from "@/components/AppCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApkFileWithFeatures } from "@shared/schema";

export default function CategoryPage() {
  const [match, params] = useRoute('/category/:category');
  const category = params?.category || '';
  
  const categoryDisplayNames: Record<string, string> = {
    'games': 'Games',
    'social': 'Social',
    'entertainment': 'Entertainment',
    'utilities': 'Utilities',
    'education': 'Education',
    'music-audio': 'Music & Audio',
    'security': 'Security',
    'trending': 'Trending',
    'latest': 'Latest Uploads',
  };
  
  const getQueryKey = () => {
    if (category === 'trending') return ['/api/apks/trending'];
    if (category === 'latest') return ['/api/apks/latest'];
    return [`/api/apks/category/${category}`];
  };
  
  const { data: apps, isLoading } = useQuery<ApkFileWithFeatures[]>({
    queryKey: getQueryKey(),
  });
  
  const AppCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-4">
      <div className="flex items-start mb-3">
        <Skeleton className="w-16 h-16 rounded-lg mr-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex space-x-2 mb-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-full mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
  
  if (!match) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {categoryDisplayNames[category] || category}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 8 }).map((_, idx) => (
            <AppCardSkeleton key={`category-skeleton-${idx}`} />
          ))
        ) : apps && apps.length > 0 ? (
          // Render apps
          apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No apps found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
