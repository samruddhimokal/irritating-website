import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Moon, Sun, Menu, Music, Zap } from 'lucide-react';

const DarkIrritatingWebsiteWithSound = () => {
  const [popups, setPopups] = useState([]);
  const [buttonPosition, setButtonPosition] = useState({ x: 100, y: 100 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [soundEffect, setSoundEffect] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setIsLoading(prev => !prev);
      simulateSound('loading');
    }, 500);

    setTimeout(() => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      simulateSound('complete');
    }, 5000);

    console.log('Setting up intervals');
    const popupInterval = setInterval(() => {
      console.log('Attempting to create popup');
      if (popups.length < 5) {
        setPopups(prev => {
          console.log('Creating new popup');
          return [...prev, {
            id: Date.now(),
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 100),
          }];
        });
        simulateSound('popup');
      }
    }, 3000);

    const shakeInterval = setInterval(() => {
      setShakeScreen(true);
      simulateSound('shake');
      setTimeout(() => setShakeScreen(false), 500);
    }, 10000);

    const backgroundMusicInterval = setInterval(() => {
      simulateSound('music');
    }, 5000);

    return () => {
      console.log('Cleaning up intervals');
      clearInterval(popupInterval);
      clearInterval(shakeInterval);
      clearInterval(backgroundMusicInterval);
    };
  }, [popups.length, simulateSound]);

  const handleMouseMove = (e) => {
    setTimeout(() => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    }, 200);
  };

  const moveButton = () => {
    setButtonPosition({
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 40),
    });
    simulateSound('move');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    setRotationDegree(prev => prev + 180);
    simulateSound('toggle');
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setZoomLevel(prev => prev === 100 ? 150 : 100);
    simulateSound('menu');
  };

  const closePopup = (id) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
    simulateSound('close');
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    simulateSound('mute');
  };

  const simulateSound = (type) => {
    if (isMuted) return;
    setSoundEffect(type);
    setTimeout(() => setSoundEffect(null), 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-2xl text-gray-200 animate-ping">
          {isLoading ? "Loading..." : "Almost there..."}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={contentRef}
      className={`relative w-full h-screen overflow-hidden ${shakeScreen ? 'animate-shake' : ''}`}
      style={{
        background: '#0a0a0a',
        fontFamily: 'Comic Sans MS, cursive',
        cursor: 'none',
        transform: `rotate(${rotationDegree}deg) scale(${zoomLevel / 100})`,
        transition: 'transform 0.5s ease-in-out',
        border: '2px solid red',  // Add this line
        padding: '20px',          // Add this line
      }}
      onMouseMove={handleMouseMove}
    >
      <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-purple-400 animate-bounce">DarkIrritating.com</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-700 animate-spin">
            {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-400" />}
          </button>
          <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-700 animate-pulse">
            <Menu className="text-gray-300" />
          </button>
          <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-700">
            {isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-green-500" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gray-800 p-4 shadow-lg animate-slide-in">
            <button onClick={toggleMenu} className="absolute top-2 right-2 text-gray-300">
              <X />
            </button>
            <ul className="mt-8 space-y-4">
              <li className="text-purple-400 animate-bounce">Home</li>
              <li className="text-green-400 animate-pulse">About</li>
              <li className="text-blue-400 animate-spin">Contact</li>
            </ul>
          </div>
        </div>
      )}
      
      {popups.map((popup) => (
        <div 
          key={popup.id}
          className="absolute bg-gray-800 rounded-lg shadow-lg p-4 w-64 animate-bounce"
          style={{ left: popup.x, top: popup.y, zIndex: 30, border: '2px solid yellow', color: 'white' }}
        >
          <p className="text-sm text-gray-200">
            {Math.random() > 0.5 ? 
              "This popup is here to stay!" : 
              "You thought you could close this? Think again!"}
          </p>
          <button 
            onClick={() => closePopup(popup.id)} 
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          >
            <X />
          </button>
          <Zap className="mt-2 text-yellow-500 animate-pulse" />
        </div>
      ))}
      
      <button
        className="absolute bg-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-150"
        style={{ left: buttonPosition.x, top: buttonPosition.y, zIndex: 20 }}
        onMouseOver={moveButton}
      >
        Try to click me!
      </button>
      
      <div 
        className="fixed w-6 h-6 bg-blue-500 rounded-full pointer-events-none transition-all duration-200 ease-out animate-ping"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      />

      <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-full shadow-lg animate-bounce">
        <Music size={24} className="text-green-400" />
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-2">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="text-purple-400 mx-4 text-lg">Breaking news: This website now causes auditory hallucinations! 🎵</span>
          <span className="text-green-400 mx-4 text-lg">Warning: Side effects may include uncontrollable dancing! 💃</span>
        </div>
      </div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-500 animate-pulse">
        Congratulations! You've won eternal confusion!
      </div>

      {soundEffect && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full animate-fadeout">
          Sound: {soundEffect}
        </div>
      )}
    </div>
  );
};

export default DarkIrritatingWebsiteWithSound;