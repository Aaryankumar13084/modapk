import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FeaturedApps } from "@/components/FeaturedApps";
import { AppCard } from "@/components/AppCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApkFileWithFeatures } from "@shared/schema";

export default function Home() {
  const { data: trendingApps, isLoading: isTrendingLoading } = useQuery<ApkFileWithFeatures[]>({
    queryKey: ['/api/apks/trending'],
  });
  
  const { data: latestApps, isLoading: isLatestLoading } = useQuery<ApkFileWithFeatures[]>({
    queryKey: ['/api/apks/latest'],
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
    <>
      <FeaturedApps />
      
      {/* Trending Section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Trending Apps</h2>
          <Link href="/category/trending">
            <Button variant="link" className="text-primary hover:text-indigo-700">
              View all
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isTrendingLoading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, idx) => (
              <AppCardSkeleton key={`trending-skeleton-${idx}`} />
            ))
          ) : trendingApps && trendingApps.length > 0 ? (
            // Render apps
            trendingApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No trending apps available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Latest Apps Section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Latest Uploads</h2>
          <Link href="/category/latest">
            <Button variant="link" className="text-primary hover:text-indigo-700">
              View all
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLatestLoading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, idx) => (
              <AppCardSkeleton key={`latest-skeleton-${idx}`} />
            ))
          ) : latestApps && latestApps.length > 0 ? (
            // Render apps
            latestApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No recent uploads available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
