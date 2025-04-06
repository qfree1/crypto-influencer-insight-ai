
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2 bg-background/70 backdrop-blur-lg border-b border-border/30" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and title */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <img 
              src="/lovable-uploads/ce27c7ed-3e76-43e2-a2eb-3e44bea8d256.png" 
              alt="Web3D Logo" 
              className={cn(
                "w-10 h-10 circle-glow logo-spin",
                scrolled ? "scale-90" : "scale-100"
              )}
            />
            {!scrolled && (
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl -z-10 opacity-70 animate-pulse-subtle"></div>
            )}
          </div>
          
          <h1 className={cn(
            "font-bold text-gradient transition-all duration-300",
            scrolled ? "text-lg" : "text-xl"
          )}>
            Web3D Influencer Analysis
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Button 
            variant="link" 
            className={cn(
              "text-foreground/80 hover:text-foreground hover:bg-transparent px-0",
              location.pathname === "/" && "text-primary font-medium"
            )}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button 
            variant="link" 
            className={cn(
              "text-foreground/80 hover:text-foreground hover:bg-transparent px-0",
              location.pathname === "/analyze" && "text-primary font-medium"
            )}
            onClick={() => navigate("/analyze")}
          >
            Analyze
          </Button>
          <Button 
            variant="link" 
            className="text-foreground/80 hover:text-foreground hover:bg-transparent px-0"
          >
            Resources
          </Button>
        </div>

        {/* Mobile menu button */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/40 p-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              className={cn(
                "justify-start",
                location.pathname === "/" && "bg-muted"
              )}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                "justify-start",
                location.pathname === "/analyze" && "bg-muted"
              )}
              onClick={() => navigate("/analyze")}
            >
              Analyze
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start"
            >
              Resources
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
