
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavigationLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
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
    </>
  );
};

export default NavigationLinks;
