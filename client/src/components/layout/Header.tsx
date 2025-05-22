import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SearchBar } from "@/components/SearchBar";
import { RiAndroidLine, RiMenuLine } from "@/lib/icons";

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
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              type="button" 
              className="lg:hidden mr-3 text-gray-500 hover:text-gray-700"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <RiMenuLine className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center">
              <RiAndroidLine className="text-3xl text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">ModAPK Hub</span>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex items-center">
            <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  );
}
