import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function FeaturedApps() {
  const { data: featuredApps } = useQuery({
    queryKey: ['/api/apks/featured'],
  });
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Apps</h2>
      <div className="relative rounded-lg overflow-hidden">
        <div className="h-64 md:h-80 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="h-full flex items-center px-8">
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Premium Games Mod</h3>
              <p className="text-white text-opacity-90 mb-4">
                Download the latest mod APKs with unlimited resources, no ads, and unlocked features.
              </p>
              <Link href="/category/games">
                <Button className="bg-white text-indigo-700 hover:bg-gray-100">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
