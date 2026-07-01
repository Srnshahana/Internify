import React, { useState, useEffect } from 'react';

export default function Test() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mentors = [1,2,3,4,5];
  useEffect(() => {
    const int = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return <div>{activeIndex}</div>
}
