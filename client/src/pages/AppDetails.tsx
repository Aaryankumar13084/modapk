import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RiDownloadLine, RiStarFill, RiStarHalfFill, RiStarLine, RiImageLine } from "@/lib/icons";
import type { ApkFileWithFeatures } from "@shared/schema";

export default function AppDetails() {
  const [match, params] = useRoute('/app/:id');
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: app, isLoading } = useQuery<ApkFileWithFeatures>({
    queryKey: [`/api/apks/${id}`],
    enabled: !!id,
  });
  
  // Function to render star rating
  const renderRating = (rating: number) => {
    // Rating is on a scale of 0-50 (for half stars)
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = rating % 10 >= 5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-xl">
        {[...Array(fullStars)].map((_, i) => (
          <RiStarFill key={`full-${i}`} className="text-amber-500" />
        ))}
        
        {hasHalfStar && <RiStarHalfFill className="text-amber-500" />}
        
        {[...Array(emptyStars)].map((_, i) => (
          <RiStarLine key={`empty-${i}`} className="text-amber-500" />
        ))}
      </div>
    );
  };
  
  // Function to get feature details
  const getFeatureDetails = (feature: string) => {
    const features: Record<string, { bgColor: string, textColor: string, label: string }> = {
      'no-ads': { 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800', 
        label: 'No Ads' 
      },
      'premium': { 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-800', 
        label: 'Premium' 
      },
      'anti-ban': { 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800', 
        label: 'Anti-Ban' 
      },
      'unlimited-resources': { 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800', 
        label: 'Unlimited Resources' 
      },
      'pro-features': { 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800', 
        label: 'Pro Features' 
      },
      'radar-hack': { 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800', 
        label: 'Radar Hack' 
      },
      'background-play': { 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800', 
        label: 'Background Play' 
      },
      'hd-support': { 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800', 
        label: 'HD Support' 
      },
      'save-media': { 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-800', 
        label: 'Save Media' 
      },
    };
    
    return features[feature] || { 
      bgColor: 'bg-gray-100', 
      textColor: 'text-gray-800', 
      label: feature 
    };
  };
  
  if (!match) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">App Not Found</h2>
          <p className="text-gray-600">The app you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start">
              <Skeleton className="w-24 h-24 rounded-lg mr-6" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex space-x-1">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="mt-6 space-y-6">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
              
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!app) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">App Not Found</h2>
          <p className="text-gray-600">The app you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start">
            {app.iconPath ? (
              <img 
                className="w-24 h-24 rounded-lg object-cover mr-6" 
                src={`/api/uploads/${app.iconPath}`} 
                alt={`${app.name} Icon`} 
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center mr-6">
                <RiImageLine className="text-gray-400 text-3xl" />
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
              <p className="text-gray-500 mt-1 capitalize">{app.category}</p>
              <div className="flex items-center mt-2">
                {renderRating(app.rating)}
                <span className="text-gray-500 ml-2">{(app.rating / 10).toFixed(1)}</span>
              </div>
              <p className="text-gray-600 mt-1">{app.downloads.toLocaleString()} Downloads</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Features</h2>
              <div className="flex flex-wrap gap-2">
                {app.features.map((feature, index) => {
                  const { bgColor, textColor, label } = getFeatureDetails(feature);
                  return (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`${bgColor} ${textColor} border-transparent`}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{app.description}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">App Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="text-gray-900">{app.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="text-gray-900">{app.size}</p>
                </div>
              </div>
            </div>
            
            <div>
              <a 
                href={`/api/apks/${app.id}/download`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="flex items-center">
                  <RiDownloadLine className="mr-2" /> Download APK
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
