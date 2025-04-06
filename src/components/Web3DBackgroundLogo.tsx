
import React from 'react';

const Web3DBackgroundLogo = () => {
  return (
    <div className="fixed -z-10 opacity-5 w-full h-full overflow-hidden pointer-events-none">
      <img 
        src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png"
        alt="Web3D Background Logo"
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 animate-pulse-subtle"
      />
    </div>
  );
};

export default Web3DBackgroundLogo;
