import { Link, useLocation } from "wouter";
import { 
  RiHomeLine, 
  RiGamepadLine, 
  RiMessage2Line, 
  RiFilmLine, 
  RiToolsLine, 
  RiBookOpenLine, 
  RiMusicLine, 
  RiSafeLine 
} from "@/lib/icons";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();
  
  const categories: Category[] = [
    { id: 'games', name: 'Games', icon: <RiGamepadLine className="mr-3 text-lg" /> },
    { id: 'social', name: 'Social', icon: <RiMessage2Line className="mr-3 text-lg" /> },
    { id: 'entertainment', name: 'Entertainment', icon: <RiFilmLine className="mr-3 text-lg" /> },
    { id: 'utilities', name: 'Utilities', icon: <RiToolsLine className="mr-3 text-lg" /> },
    { id: 'education', name: 'Education', icon: <RiBookOpenLine className="mr-3 text-lg" /> },
    { id: 'music-audio', name: 'Music & Audio', icon: <RiMusicLine className="mr-3 text-lg" /> },
    { id: 'security', name: 'Security', icon: <RiSafeLine className="mr-3 text-lg" /> },
  ];
  
  const isActiveCategory = (categoryId: string) => {
    return location === `/category/${categoryId}`;
  };
  
  return (
    <div 
      className={`${sidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'} lg:block lg:relative lg:z-auto`}
    >
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden"
        ></div>
      )}
      
      {/* Sidebar Content */}
      <div 
        className={`${
          sidebarOpen 
            ? 'relative flex-1 flex flex-col max-w-xs w-full bg-white' 
            : 'hidden lg:flex lg:flex-col'
        } lg:w-64 lg:flex-shrink-0 border-r border-gray-200 bg-white`}
      >
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 px-2 space-y-1">
            <Link 
              href="/" 
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location === '/' 
                  ? 'bg-indigo-50 text-primary' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <RiHomeLine className={`mr-3 text-lg ${location === '/' ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
              Home
            </Link>
            
            <div className="pt-2 pb-1 px-2 font-medium text-sm text-gray-500 uppercase tracking-wider">
              Categories
            </div>
            
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActiveCategory(category.id) 
                    ? 'bg-indigo-50 text-primary' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <span className={`${isActiveCategory(category.id) ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
                  {category.icon}
                </span>
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
