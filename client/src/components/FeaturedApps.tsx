import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { RiUploadCloud2Line } from "@/lib/icons";

export function FeaturedApps() {
  const { data: featuredApps } = useQuery({
    queryKey: ['/api/apks/featured'],
  });
  
  return (
    <div className="px-3 sm:px-6 lg:px-8 mb-8">
      <h2 className="text-2xl font-bold text-primary-foreground mb-4">Featured Apps</h2>
      <div className="relative rounded-xl overflow-hidden">
        <div className="h-60 md:h-72 bg-gradient-to-r from-primary via-blue-500 to-indigo-600">
          <div className="h-full flex items-center justify-between px-4 sm:px-8 relative">
            <div className="max-w-lg z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">ModAPK Hub</h3>
              <p className="text-white text-opacity-90 mb-4 text-sm sm:text-base">
                Download premium apps with unlimited resources, no ads, and unlocked features for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/upload">
                  <Button className="bg-white text-primary hover:bg-gray-100 border-0">
                    <RiUploadCloud2Line className="mr-2" /> Upload APK
                  </Button>
                </Link>
                <Link href="/category/games">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Browse Apps
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block absolute right-8 bottom-0">
              <div className="w-40 h-40 bg-white/10 rounded-full backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
