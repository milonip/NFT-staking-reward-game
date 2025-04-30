import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils";

export default function CountdownTimer() {
  const [time, setTime] = useState({
    hours: 12,
    minutes: 43,
    seconds: 22
  });
  
  useEffect(() => {
    // Set the end time to 24 hours from now for demo purposes
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTime(remaining);
      
      if (remaining.hours <= 0 && remaining.minutes <= 0 && remaining.seconds <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex space-x-2">
      <div className="flex flex-col items-center justify-center rounded-lg w-[60px] h-[60px] bg-surface shadow-lg">
        <span className="text-xl font-bold space-grotesk">{String(time.hours).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary">Hours</span>
      </div>
      
      <div className="flex flex-col items-center justify-center rounded-lg w-[60px] h-[60px] bg-surface shadow-lg">
        <span className="text-xl font-bold space-grotesk">{String(time.minutes).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary">Min</span>
      </div>
      
      <div className="flex flex-col items-center justify-center rounded-lg w-[60px] h-[60px] bg-surface shadow-lg">
        <span className="text-xl font-bold space-grotesk">{String(time.seconds).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary">Sec</span>
      </div>
    </div>
  );
}
