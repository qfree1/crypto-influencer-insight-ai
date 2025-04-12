
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ParticleBackground from "./components/ParticleBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { saveApiConfig } from "./services/keyManagementService";
import { DEFAULT_API_CONFIG } from "./constants/apiConfig";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Initialize API configuration if not exists
  useEffect(() => {
    // Initialize secure API configuration
    saveApiConfig(DEFAULT_API_CONFIG);
    console.log("API configuration initialized with defaults");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background relative overflow-hidden">
          <ParticleBackground />
          
          <div className="glass-effect min-h-screen flex flex-col">
            <BrowserRouter>
              <Header />
              
              {/* Main content with padding for fixed header */}
              <main className="flex-grow pt-24">
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/analyze" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <Footer />
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
