import { useEffect, useState } from 'react';

function getWindowWidth() {
  return window.innerWidth;
}

export default function useWindowDimension() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowWidth());

  const isMobile = windowDimensions <= 480;
  const isTablet = windowDimensions > 480 && windowDimensions <= 768;
  const isLaptop = windowDimensions > 768 && windowDimensions <= 1300;
  const isDesktop = windowDimensions > 1300;

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowWidth());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPanelWidth = () => {
    if (isMobile) {
      return '100%';
    } else if (isTablet) {
      return '60%';
    } else if (isLaptop) {
      return '40%';
    } else {
      return '30%';
    }
  };

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    windowDimensions,
    getPanelWidth,
  };
}
