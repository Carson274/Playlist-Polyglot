import {useEffect, useState} from "react";
import './App.css';
import Home_Page from "./pages/Home_Page";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top_Songs_Page from "./pages/Top_Songs_Page";
import WaveComponent from "./components/WaveComponent";
import NavComponent from "./components/NavComponent";

function App() {
    const CLIENT_ID = "bcf7d300a78f47d79ce343e582ee60f6"
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

    return (
        token ? (
            <Router>
                <Routes>
                    <Route path="/" element={<Home_Page token={token} logout={logout} />} />
                    <Route path="/top-songs" element={<Top_Songs_Page token={token} logout={logout} />} />
                </Routes>
            </Router>
        ) : (
            <>
                <NavComponent />

                <div className="App flex flex-col justify-center items-center min-h-screen grey-background">
                    <header className="App-header"></header>
                    <h1 className='title text-6xl font-bold mb-4'>Playlist Polyglot</h1>
                    <a className='text-2xl underline' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`}>
                        <button className="btn btn-primary btn-outline font-bold py-2 px-4 rounded mt-2">Login to Spotify</button>
                    </a>
                </div>

                <WaveComponent />
            </>
        )
    );
}

export default App;