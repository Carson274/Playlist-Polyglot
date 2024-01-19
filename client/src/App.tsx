import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Home_Page from "./pages/Home_Page";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top_Songs_Page from "./pages/Top_Songs_Page";
import WaveComponent from "./components/WaveComponent";
import NavComponent from "./components/NavComponent";
import CursorComponent from "./components/CursorComponent";

function App() {
    const CLIENT_ID = "b534b0059ab24f429f81a542522741d6"
    const REDIRECT_URI = "http://localhost:5173"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-top-read"

    const [token, setToken] = useState("")

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const headerRef = useRef(null);
    const loginRef = useRef(null);
    const cover = document.querySelector<HTMLDivElement>('.cover')!;

    const handleLoginClick = () => {
        setTimeout(() => {
            window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;
            cover.style.display = 'block';
        }, 1000);
    };

    return (
        <>
            {token ? (
                <>
                    <CursorComponent headerRef={headerRef} loginRef={loginRef} />
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home_Page token={token} logout={logout} />} />
                            <Route path="/top-songs" element={<Top_Songs_Page token={token} logout={logout} />} />
                        </Routes>
                    </Router>
                </>
            ) : (
                <>
                    <NavComponent />

                    <div className="App flex flex-col justify-center items-center min-h-screen grey-background">
                        <h1 ref={headerRef} className='title text-5xl md:text-6xl lg:text-8xl font-bold mb-4 text-wrap'>
                            Playlist Polyglot
                        </h1>
                        <a className='text-2xl underline'>
                            <button 
                                ref={loginRef} 
                                className="cursor-none btn btn-primary btn-sm md:btn-md lg:btn-lg btn-outline font-bold py-2 px-4 rounded mt-2"
                                onClick={handleLoginClick}
                            >
                            Login to Spotify
                        </button>
                        </a>
                    </div>
                    <CursorComponent headerRef={headerRef} loginRef={loginRef} />

                    <WaveComponent />
                </>
            )}
        </>
    );
}

export default App;