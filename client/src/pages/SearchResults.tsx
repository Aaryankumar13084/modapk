import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AppCard } from "@/components/AppCard";
import { Skeleton } from "@/components/ui/skeleton";
import { RiSearchLine } from "@/lib/icons";
import type { ApkFileWithFeatures } from "@shared/schema";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  
  const { data: apps, isLoading } = useQuery<ApkFileWithFeatures[]>({
    queryKey: [`/api/apks/search?q=${encodeURIComponent(query)}`],
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
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Search Results
      </h2>
      <p className="text-gray-600 mb-6">
        {query ? `Showing results for "${query}"` : 'Please enter a search query'}
      </p>
      
      {query ? (
        isLoading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <AppCardSkeleton key={`search-skeleton-${idx}`} />
            ))}
          </div>
        ) : apps && apps.length > 0 ? (
          // Search results
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          // No results
          <div className="text-center py-10">
            <RiSearchLine className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-gray-500">
              We couldn't find any apps matching your search. Try using different keywords.
            </p>
          </div>
        )
      ) : (
        // No query provided
        <div className="text-center py-10">
          <RiSearchLine className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Enter a search query</h3>
          <p className="mt-1 text-gray-500">
            Type what you're looking for in the search bar above.
          </p>
        </div>
      )}
    </div>
  );
}
