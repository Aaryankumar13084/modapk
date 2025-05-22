import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import AppDetails from "@/pages/AppDetails";
import Upload from "@/pages/Upload";
import SearchResults from "@/pages/SearchResults";
import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Footer } from "./components/layout/Footer";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
              <main className="py-6">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/category/:category" component={CategoryPage} />
                  <Route path="/app/:id" component={AppDetails} />
                  <Route path="/upload" component={Upload} />
                  <Route path="/search" component={SearchResults} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>
          </div>
          
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
