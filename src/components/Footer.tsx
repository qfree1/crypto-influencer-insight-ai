
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-background/30 backdrop-blur-sm border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo and info */}
          <div className="flex flex-col items-center md:items-start gap-4 max-w-xs">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/ce27c7ed-3e76-43e2-a2eb-3e44bea8d256.png" 
                alt="Web3D Logo" 
                className="w-8 h-8 circle-glow" 
              />
              <span className="font-bold text-gradient">Web3D</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              AI-powered blockchain risk analysis for crypto influencers
            </p>
          </div>
          
          {/* Quick links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-medium mb-2">Platform</h3>
              <Button variant="link" className="h-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="link" className="h-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate("/analyze")}>
                Analyze
              </Button>
              <Button variant="link" className="h-7 p-0 text-muted-foreground hover:text-foreground">
                How It Works
              </Button>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-medium mb-2">Resources</h3>
              <Button variant="link" className="h-7 p-0 text-muted-foreground hover:text-foreground">
                Documentation
              </Button>
              <Button variant="link" className="h-7 p-0 text-muted-foreground hover:text-foreground">
                API
              </Button>
              <Button variant="link" className="h-7 p-0 text-muted-foreground hover:text-foreground">
                FAQ
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-border/50" />
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Copyright © {currentYear} Web3Decision. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
