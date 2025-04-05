import React from 'react';

const LoadingWave = () => {
  return (
    <div className="w-[300px] h-[100px] flex justify-center items-end">
      {[0, 0.1, 0.2, 0.3].map((delay) => (
        <div 
          key={delay}
          className="w-[20px] h-[10px] mx-[5px] bg-green-700 rounded-[5px]"
          style={{
            animation: 'wave 1s ease-in-out infinite',
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingWave;