import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Menu from '../util/Menu'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function Header({ mode, setMode }) {
    const { pathname } = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(mode === 'dark');
    const toggleMode = () => {
        const newMode = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        setMode(newMode);
    };
    return (
        <header>
        <h1>
            <Link to="/">
                <h1>Cryypto-Geeks</h1>
            </Link>
        </h1>
        <ul>
            {Menu.map((item) => (
                <Link to={item.url} key={item.url}> 
                <li className={`${isDarkMode ? 'dark' : 'light'} ${pathname === item.url ? 'active' : ''}`}>{item.title}</li>
                </Link>
            ))}
            <button className="theme-toggler" onClick={toggleMode}>{isDarkMode ? <FaSun /> : <FaMoon />}</button>
        </ul>
        </header>
    )
}
