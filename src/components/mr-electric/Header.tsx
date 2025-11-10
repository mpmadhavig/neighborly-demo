import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-white" style={{backgroundColor: '#003DA5', padding: '5px'}}>
      <div className="max-w-7xl mx-auto px-4">
        <a 
          href="https://www.neighborly.com/"
          title="White Neighborly logo. - open in new tab" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="neighborly-logo.png" alt="White Neighborly logo." width="83" height="17" />      
        </a>
      </div>
    </div>
  );
};
