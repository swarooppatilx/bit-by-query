// hooks/useTimer.js
import { useState, useEffect } from "react";

export const useTimer = (problemId) => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timerInterval;

    if (startTime) {
      timerInterval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000);
        setElapsedTime(duration * 1000);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [startTime]);

  useEffect(() => {
    if (problemId) {
      setStartTime(new Date());
      setElapsedTime(0);
    }
  }, [problemId]);

  return elapsedTime;
};

export default useTimer;