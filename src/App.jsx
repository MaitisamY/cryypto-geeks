import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './styles/index.css'
import './styles/header.css'
import './styles/home.css'
import './styles/coin.css'
import './styles/footer.css'
const Home = lazy(() => import('./pages/Home'))
const Exchanges = lazy(() => import('./pages/Exchanges'))
const News = lazy(() => import('./pages/News'))
const Coin = lazy(() => import('./pages/Coin'))
import Header from './components/Header'
import Loader from './components/Loader'
import Footer from './components/Footer'
import { BsChevronUp } from 'react-icons/bs'


function App() {
  const storedPreference = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(storedPreference === 'dark');
  const [scrollUp, setScrollUp] = useState(false);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 200) {
        setScrollUp(true);
      } else {
        setScrollUp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <Suspense fallback={<Loader />}>
        <Router>
            <div className={`theme ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <Header mode={isDarkMode} setMode={toggleDarkMode} />
                <main>
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path='/exchanges' element={<Exchanges />} />
                      <Route path='/news' element={<News />} />
                      <Route path="/coin/:name" element={<Coin />} />
                  </Routes>
                </main>
                {
                    scrollUp &&
                    <BsChevronUp 
                        className={`scroll-up ${scrollUp ? 'show' : ''}`} 
                        onClick={backToTop}
                    />
                }
                <Footer />
            </div>
        </Router>
    </Suspense>
  );
}

export default App;
