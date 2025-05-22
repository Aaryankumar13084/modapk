import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApkFileWithFeatures } from "@shared/schema";
import { 
  RiStarFill, 
  RiStarHalfFill, 
  RiStarLine, 
  RiCheckLine, 
  RiShieldCheckLine, 
  RiVipCrownLine, 
  RiDownloadLine,
  RiFireLine,
  RiHdLine,
  RiPlayCircleLine,
  RiSpeedLine,
  RiCoinsLine,
  RiToolsFill,
  RiImageLine
} from "@/lib/icons";

interface AppCardProps {
  app: ApkFileWithFeatures;
}

export function AppCard({ app }: AppCardProps) {
  // Function to render star rating
  const renderRating = (rating: number) => {
    // Rating is on a scale of 0-50 (for half stars)
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = rating % 10 >= 5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
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
  
  // Function to get feature icon and color
  const getFeatureDetails = (feature: string) => {
    const features: Record<string, { icon: React.ReactNode, bgColor: string, textColor: string, label: string }> = {
      'no-ads': { 
        icon: <RiCheckLine className="mr-1" />, 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800', 
        label: 'No Ads' 
      },
      'premium': { 
        icon: <RiVipCrownLine className="mr-1" />, 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-800', 
        label: 'Premium' 
      },
      'anti-ban': { 
        icon: <RiShieldCheckLine className="mr-1" />, 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800', 
        label: 'Anti-Ban' 
      },
      'unlimited-resources': { 
        icon: <RiCoinsLine className="mr-1" />, 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800', 
        label: 'Unlimited Resources' 
      },
      'pro-features': { 
        icon: <RiToolsFill className="mr-1" />, 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800', 
        label: 'Pro Features' 
      },
      'radar-hack': { 
        icon: <RiSpeedLine className="mr-1" />, 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800', 
        label: 'Radar Hack' 
      },
      'background-play': { 
        icon: <RiPlayCircleLine className="mr-1" />, 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800', 
        label: 'Background Play' 
      },
      'hd-support': { 
        icon: <RiHdLine className="mr-1" />, 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800', 
        label: 'HD Support' 
      },
      'save-media': { 
        icon: <RiDownloadLine className="mr-1" />, 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-800', 
        label: 'Save Media' 
      },
    };
    
    return features[feature] || { 
      icon: <RiCheckLine className="mr-1" />, 
      bgColor: 'bg-gray-100', 
      textColor: 'text-gray-800', 
      label: feature 
    };
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start mb-3">
          {app.iconPath ? (
            <img 
              className="w-16 h-16 rounded-lg object-cover mr-3" 
              src={`/api/uploads/${app.iconPath}`} 
              alt={`${app.name} Icon`} 
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
              <RiImageLine className="text-gray-400 text-2xl" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{app.name}</h3>
            <p className="text-sm text-gray-500">{app.category}</p>
            <div className="flex items-center mt-1">
              {renderRating(app.rating)}
              <span className="text-xs text-gray-500 ml-1">{(app.rating / 10).toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-3 flex flex-wrap gap-1">
          {app.features.slice(0, 2).map((feature, index) => {
            const { icon, bgColor, textColor, label } = getFeatureDetails(feature);
            return (
              <Badge 
                key={index} 
                variant="outline" 
                className={`${bgColor} ${textColor} border-transparent flex items-center`}
              >
                {icon} {label}
              </Badge>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mb-3">{app.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">v{app.version} • {app.size}</span>
          <div className="flex space-x-2">
            <Link href={`/app/${app.id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
            <a href={`/api/apks/${app.id}/download`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="inline-flex items-center">
                <RiDownloadLine className="mr-1" /> Download
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
