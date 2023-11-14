import React from 'react';

const VibrationComponent = () => {
  const handleVibration = () => {
    // Check if the Vibration API is supported
    if ('vibrate' in navigator) {
      // Vibrate for 500 milliseconds
      navigator.vibrate(500);
    }
  };

  const handlePatternVibration = () => {
    if ('vibrate' in navigator) {
      // Vibrate in a pattern: vibrate, pause, vibrate, pause...
      navigator.vibrate([500, 200, 500]);
    }
  };

  return (
    <div>
      <button onClick={handleVibration}>Vibrate Once</button>
      <button onClick={handlePatternVibration}>Vibrate Pattern</button>
    </div>
  );
};

export default VibrationComponent;