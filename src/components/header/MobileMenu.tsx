
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  walletAddress: string | null;
  tokenBalance: string;
  isLoadingBalance?: boolean;
  handleDisconnect: () => void;
}

const MobileMenu = ({
  mobileMenuOpen,
  walletAddress,
  tokenBalance,
  isLoadingBalance = false,
  handleDisconnect,
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  if (!mobileMenuOpen) return null;

  return (
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
        {walletAddress && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/80 border border-primary/30">
            <img 
              src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
              alt="Web3D Token" 
              className="h-5 w-5" 
            />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">WEB3D Balance</span>
              {isLoadingBalance ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <span className="font-medium">{tokenBalance || "0.00"}</span>
              )}
            </div>
          </div>
        )}

        {/* Mobile Wallet Options */}
        {walletAddress ? (
          <>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/80 border border-primary/30">
              <span className="text-xs text-muted-foreground">Wallet</span>
              <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
            </div>
            
            <Button
              variant="outline"
              className="justify-start border-destructive/30 text-destructive"
              onClick={handleDisconnect}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect Wallet
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MobileMenu;
