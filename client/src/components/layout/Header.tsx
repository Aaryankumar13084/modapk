import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SearchBar } from "@/components/SearchBar";
import { RiAndroidLine, RiMenuLine, RiUploadLine } from "@/lib/icons";

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Header({ sidebarOpen, toggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <header className="bg-white shadow-sm z-20 sticky top-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              type="button" 
              className="lg:hidden mr-2 text-primary hover:text-primary-dark rounded-full p-1 hover:bg-gray-100"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <RiMenuLine className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center">
              <RiAndroidLine className="text-3xl text-primary mr-2" />
              <span className="text-xl font-bold text-primary hidden sm:inline">ModAPK Hub</span>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-1 max-w-md mx-3">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex items-center">
            <Link href="/upload" className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <RiUploadLine className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Upload</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
