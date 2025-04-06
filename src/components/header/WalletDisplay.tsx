
import React from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut, ExternalLink, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface WalletDisplayProps {
  walletAddress: string | null;
  tokenBalance: string;
  handleDisconnect: () => void;
}

const WalletDisplay = ({ walletAddress, tokenBalance, handleDisconnect }: WalletDisplayProps) => {
  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  return (
    <div className="flex items-center space-x-6">
      {/* Web3D Balance Display */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 border border-primary/30 backdrop-blur-sm">
        <img 
          src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
          alt="Web3D Token" 
          className="h-5 w-5" 
        />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">WEB3D Balance</span>
          <span className="font-medium text-sm">{tokenBalance}</span>
        </div>
      </div>

      {/* User Menu (when wallet is connected) */}
      {walletAddress && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 border-primary/30">
              <User className="h-4 w-4" />
              <span className="font-mono">{formatAddress(walletAddress)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyAddressToClipboard}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Copy Wallet Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`https://bscscan.com/address/${walletAddress}`, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View on Explorer</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletDisplay;
