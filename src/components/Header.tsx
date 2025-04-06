
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu, X, Wallet } from "lucide-react";
import { connectToWallet, WalletProvider } from "@/services/walletService";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

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

  const handleConnectWallet = async (provider: WalletProvider) => {
    setIsConnecting(true);
    try {
      const state = await connectToWallet(provider);
      
      if (state.isConnected) {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${state.address?.substring(0, 6)}...${state.address?.substring(38)}`,
        });
        setWalletDialogOpen(false);
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

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
              src="/lovable-uploads/c1b8b8f0-c5bf-489f-a603-c8465207d3dd.png" 
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

        {/* Navigation Links and Wallet Button */}
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

          {/* Wallet Connection Dialog */}
          <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-primary/30"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/70 border-primary/20">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-gradient">Connect Your Wallet</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div 
                  className="p-4 flex flex-col items-center justify-center space-y-3 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer border rounded-md"
                  onClick={() => handleConnectWallet(WalletProvider.METAMASK)}
                >
                  <img src="/lovable-uploads/73fc4d25-781d-4f86-be71-b68f1778b7b4.png" alt="MetaMask" className="w-12 h-12 object-contain" />
                  <p className="text-sm font-medium">MetaMask</p>
                </div>
                
                <div 
                  className="p-4 flex flex-col items-center justify-center space-y-3 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer border rounded-md"
                  onClick={() => handleConnectWallet(WalletProvider.TRUST)}
                >
                  <img src="/lovable-uploads/212c9c57-a683-4ee4-81fe-e2fe24888583.png" alt="Trust Wallet" className="w-12 h-12 object-contain" />
                  <p className="text-sm font-medium">Trust Wallet</p>
                </div>
                
                <div 
                  className="p-4 flex flex-col items-center justify-center space-y-3 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer border rounded-md"
                  onClick={() => handleConnectWallet(WalletProvider.BINANCE)}
                >
                  <img src="/lovable-uploads/9c6ae1c8-af03-4b27-b7d0-e1b168670e9a.png" alt="Binance Wallet" className="w-12 h-12 object-contain" />
                  <p className="text-sm font-medium">Binance</p>
                </div>
                
                <div 
                  className="p-4 flex flex-col items-center justify-center space-y-3 bg-card/70 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer border rounded-md"
                  onClick={() => handleConnectWallet(WalletProvider.WALLETCONNECT)}
                >
                  <img src="/lovable-uploads/0ab09c9d-e9a7-4194-8201-1dc1fe804d97.png" alt="WalletConnect" className="w-12 h-12 object-contain" />
                  <p className="text-sm font-medium">WalletConnect</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              variant="default"
              className="flex items-center justify-start gap-2"
              onClick={() => {
                setWalletDialogOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
