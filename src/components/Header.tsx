
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { getTokenBalance, clearBalanceCache } from "@/services/web3/balanceService";
import { disconnectWallet } from "@/services/walletService";
import { Button } from "@/components/ui/button";

// Import the new components
import Logo from "@/components/header/Logo";
import NavigationLinks from "@/components/header/NavigationLinks";
import WalletDisplay from "@/components/header/WalletDisplay";
import MobileMenu from "@/components/header/MobileMenu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0.00");

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
          // Force clear cache to ensure fresh balance
          clearBalanceCache();
          
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            // Add retry mechanism for initial balance fetch
            let attempts = 0;
            let balance = "0.00";
            
            while (attempts < 3) {
              balance = await getTokenBalance(address);
              console.log(`Header balance attempt ${attempts + 1}:`, balance);
              if (parseFloat(balance) > 0 || attempts === 2) break;
              attempts++;
              // Small delay between retries
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
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
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          
          // Clear cache to force fresh balance
          clearBalanceCache(address);
          
          // Add retry mechanism for balance fetch
          let attempts = 0;
          let balance = "0.00";
          
          while (attempts < 3) {
            balance = await getTokenBalance(address);
            console.log(`Account changed balance attempt ${attempts + 1}:`, balance);
            if (parseFloat(balance) > 0 || attempts === 2) break;
            attempts++;
            // Small delay between retries
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          setTokenBalance(balance);
        } else {
          setWalletAddress(null);
          setTokenBalance("0.00");
        }
      };
      
      // Remove existing listeners to prevent duplicates
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      
      // Add fresh listener
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Cleanup function
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  // Handle wallet disconnect
  const handleDisconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setTokenBalance("0.00");
    
    // If on analyze page, redirect to home
    if (location.pathname === "/analyze") {
      navigate("/");
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
        {/* Logo component */}
        <Logo scrolled={scrolled} />

        {/* Navigation Links and Wallet Display for desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationLinks />
          <WalletDisplay 
            walletAddress={walletAddress} 
            tokenBalance={tokenBalance}
            handleDisconnect={handleDisconnect}
          />
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

      {/* Mobile menu component */}
      {isMobile && (
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          walletAddress={walletAddress}
          tokenBalance={tokenBalance}
          handleDisconnect={handleDisconnect}
        />
      )}
    </header>
  );
};

export default Header;
