
import React from 'react';

const Web3DBackgroundLogo = () => {
  return (
    <div className="fixed -z-10 opacity-5 w-full h-full overflow-hidden pointer-events-none">
      <img 
        src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png"
        alt="Web3D Background Logo"
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 animate-pulse-subtle"
      />
      
      {/* Add additional smaller logos for decoration */}
      <img 
        src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png"
        alt="Web3D Background Logo Small 1"
        className="absolute top-1/4 left-1/4 w-32 h-32 animate-float opacity-30"
        style={{ animationDelay: "1.5s" }}
      />
      
      <img 
        src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png"
        alt="Web3D Background Logo Small 2"
        className="absolute bottom-1/4 right-1/4 w-32 h-32 animate-float opacity-30"
        style={{ animationDelay: "2.5s" }}
      />
    </div>
  );
};

export default Web3DBackgroundLogo;
