
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu, X, CreditCard } from "lucide-react";
import { getTokenBalance } from "@/services/web3Service";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0");

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

  // Check if wallet is connected and get balance
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            const balance = await getTokenBalance(address);
            setTokenBalance(balance);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();

    // Setup listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          const balance = await getTokenBalance(address);
          setTokenBalance(balance);
        } else {
          setWalletAddress(null);
          setTokenBalance("0");
        }
      });
    }
  }, []);

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
              src="/lovable-uploads/109d7162-8b5e-408b-848d-a595d3ad9563.png" 
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

        {/* Navigation Links and Balance Display */}
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

          {/* Web3D Balance Display */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 border border-primary/30 backdrop-blur-sm">
            <CreditCard className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">WEB3D Balance</span>
              <span className="font-medium text-sm">{tokenBalance} WEB3D</span>
            </div>
          </div>
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
            
            {/* Mobile Web3D Balance Display */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/80 border border-primary/30">
              <CreditCard className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">WEB3D Balance</span>
                <span className="font-medium">{tokenBalance} WEB3D</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
