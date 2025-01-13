import { useState, useEffect } from "react";

export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return isMobile;
};

export default useScreenSize;