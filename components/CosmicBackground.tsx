
import React from 'react';

const CosmicBackground: React.FC = () => {
    const starStyle = (size: number, top: string, left: string, animationDuration: string) => ({
      width: `${size}px`,
      height: `${size}px`,
      top,
      left,
      animationDuration,
    });
  
    const stars = [
      // ... generate star properties
      starStyle(2, '10%', '25%', '10s'),
      starStyle(1, '20%', '70%', '15s'),
      starStyle(3, '5%', '90%', '8s'),
      starStyle(1, '50%', '50%', '20s'),
      starStyle(2, '80%', '10%', '12s'),
      starStyle(1, '90%', '85%', '18s'),
      starStyle(2, '40%', '5%', '9s'),
      starStyle(1, '70%', '75%', '14s'),
    ];
  
    return (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <style>
          {`
            @keyframes drift {
              from {
                transform: translateY(0px) translateX(0px);
              }
              to {
                transform: translateY(20px) translateX(-20px);
              }
            }
          `}
        </style>
        {stars.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/80 animate-[drift_linear_alternate_infinite]"
            style={style}
          />
        ))}
      </div>
    );
  };
  
export default CosmicBackground;
