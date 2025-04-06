
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  scrolled: boolean;
}

const Logo = ({ scrolled }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer" 
      onClick={() => navigate("/")}
    >
      <div className="relative">
        <img 
          src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
          alt="Web3D Logo" 
          className={cn(
            "w-12 h-12 circle-glow logo-spin",
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
  );
};

export default Logo;
