
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ParticleBackground from "./components/ParticleBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        
        {/* App Logo - visible on all pages */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <img 
            src="/lovable-uploads/4207036d-b43e-4c52-b710-684edb26b137.png" 
            alt="Web3D Logo" 
            className="w-8 h-8 circle-glow logo-spin"
          />
          <span className="font-bold text-gradient text-lg">Web3D</span>
        </div>
        
        <div className="glass-effect min-h-screen">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyze" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
