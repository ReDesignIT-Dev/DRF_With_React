import React from 'react';
import racoonLogo from 'images/racoon-logo.png';

const LogoRacoon: React.FC = () => {
  return (
    <div>
      <img src={racoonLogo} alt="Logo" />
    </div>
  );
};

export default LogoRacoon;