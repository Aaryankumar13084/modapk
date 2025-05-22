import { useState, useEffect } from "react";
import { RiSearchLine } from "@/lib/icons";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Instantly search as user types (after a small delay)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        onSearch(searchQuery);
      }
    }, 300); // Debounce by 300ms to avoid too many requests
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, onSearch]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <RiSearchLine className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
        placeholder="Search for apps..." 
      />
    </form>
  );
}
