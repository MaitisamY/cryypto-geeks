import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './styles/header.css';
import './styles/page.css';
const Home = lazy(() => import('./pages/Home'))
const Exchanges = lazy(() => import('./pages/Exchanges'))
const News = lazy(() => import('./pages/News'))
import Header from './components/Header'
import Loader from './components/Loader'


function App() {
  const storedPreference = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(storedPreference === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
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
                  </Routes>
                </main>
            </div>
        </Router>
    </Suspense>
  );
}

export default App;
