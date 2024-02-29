import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Menu from '../util/Menu'
import { BsSun, BsMoon } from 'react-icons/bs'

export default function Header({ mode, setMode }) {
    const { pathname } = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(mode === 'dark');
    const toggleMode = () => {
        const newMode = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        setMode(newMode);
    };
    return (
        <>
            <header>
                <div>
                    <h1>
                        <Link to="/">
                            <h1>Cryypto<span>Geeks</span></h1>
                        </Link>
                    </h1>
                </div>
                <div>
                    <button className="theme-toggler" onClick={toggleMode}>{isDarkMode ? <BsMoon /> : <BsSun />}</button>
                </div>
            </header>
            <div className='menu'>
                <ul>
                    {Menu.map((item) => (
                        <Link to={item.url} key={item.url}> 
                        <li className={`${pathname === item.url ? 'active' : ''}`}>{item.title}</li>
                        </Link>
                    ))}
                </ul>
            </div>
        </>
    )
}
