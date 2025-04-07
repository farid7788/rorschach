
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TestCard from './components/TestCard';
import ResultReport from './components/ResultReport';
import LoginRegister from './components/LoginRegister';
import About from './components/About';
import Contact from './components/Contact';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
    const [user, setUser] = useState(null);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [responses, setResponses] = useState([]);
    const [isDark, setIsDark] = useDarkMode();
    const { lang, changeLang, t } = useLanguage();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleStart = () => setStarted(true);
    const handleSubmit = (finalResponses) => {
        setResponses(finalResponses);
        setFinished(true);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setStarted(false);
        setFinished(false);
    };

    return (
        <Router>
            <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'} font-sans`}>
                <header className="bg-blue-700 text-white py-4 shadow">
                    <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            <Link to="/">Rorschach Test</Link>
                        </h1>
                        <nav className="space-x-3 text-sm flex items-center">
                            <Link to="/about" className="hover:underline">{t("about")}</Link>
                            <Link to="/contact" className="hover:underline">{t("contact")}</Link>
                            <button onClick={() => setIsDark(!isDark)} className="bg-white text-blue-700 px-3 py-1 rounded">
                                {isDark ? t("light_mode") : t("dark_mode")}
                            </button>
                            <select
                                value={lang}
                                onChange={(e) => changeLang(e.target.value)}
                                className="bg-white text-blue-700 px-2 py-1 rounded"
                            >
                                <option value="en">EN</option>
                                <option value="fa">FA</option>
                            </select>
                            {user && (
                                <button onClick={logout} className="bg-white text-blue-700 px-3 py-1 rounded">
                                    {t("logout")}
                                </button>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="p-4 max-w-4xl mx-auto">
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/" element={
                            !user ? (
                                <LoginRegister onLogin={handleLogin} />
                            ) : !started && !finished ? (
                                <div className="text-center mt-20">
                                    <h2 className="text-xl font-semibold mb-4">{t("welcome")}, {user.name}</h2>
                                    <p className="mb-6 text-sm">
                                        This test consists of 10 cards. For each card, describe what you see.
                                    </p>
                                    <button
                                        onClick={handleStart}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
                                    >
                                        {t("start_test")}
                                    </button>
                                </div>
                            ) : !finished ? (
                                <TestCard onSubmit={handleSubmit} />
                            ) : (
                                <ResultReport responses={responses} />
                            )
                        } />
                    </Routes>
                </main>

                <footer className="text-center text-xs mt-10 pb-4">
                    &copy; 2025 Mahru Psychology Tools. <Link to="/about" className="underline">{t("about")}</Link> | <Link to="/contact" className="underline">{t("contact")}</Link>
                </footer>
            </div>
        </Router>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;
