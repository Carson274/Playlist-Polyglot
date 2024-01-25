import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SpotifyGetPlaylists from "../components/SpotifyGetPlaylists";
import NavComponent from '../components/NavComponent';
import './Home_Page.css'
import CursorComponent from '../components/CursorComponent';
import WaveComponent from '../components/WaveComponent';
import CardComponent from '../components/CardComponent';
import PlaylistHeader from '../components/PlaylistHeader';
import img1 from "../assets/img1.svg";
import img2 from "../assets/img2.svg";
import img3 from "../assets/img3.svg";
import img4 from "../assets/img4.svg";
import img5 from "../assets/img5.svg";

const Cover = () => {
    const coverRef = useRef(null);

    useEffect(() => {
        const cover = coverRef.current;
        if (cover) {
            cover.style.animation = 'slide-down 3s cubic-bezier(0.5, 0, 0, 1) forwards';
            setTimeout(() => {
                cover.style.display = 'none';
            }, 2000);
        }
    }, []);

    return <div className="cover" ref={coverRef}></div>;
};

const Home_Page = ({ token, logout }) => {
    const headerRef = useRef(null);
    const loginRef = useRef(null);
    const [currentView, setCurrentView] = useState('playlists');

    const handleBackToTracks = () => {
        setCurrentView('tracks');
    };

    const handleBackToPlaylists = () => {
        setCurrentView('playlists');
    };

    return (
        <>  
            <Cover />
            <NavComponent token={token} logout={logout}/>
            <div className="App flex flex-col grey-background text-neutral min-h-screen">
            <div className="nav-buffer"></div>
            <div className="flex flex-col md:flex-row">
                <div className="sm:p-10 information flex flex-col w-full md:w-2/3">
                    <div className="header-div md:p-10 lg:p-20 lg:pb-4 lg:pt-10 animated-fade-in">
                        <h2 className="mt-10 md:mt-0 text-2xl md:text-4xl lg:text-6xl mb-0 md:mb-4">Learn to Sing Along with</h2>
                        <h1 className="title text-4xl md:text-6xl lg:text-8xl font-bold md:mb-0 lg:mb-4">Playlist Polyglot</h1>
                    </div>
                    <div className="instructions md:pl-10 lg:pl-20 md:pr-10 lg:pr-10">
                        <h1 className="text-sm md:text-xl lg:text-3xl mb-8">Want to sing your favorite songs from other languages? With Playlist Polyglot, you can!</h1>
                        <div className="cards-div flex flex-auto text-black space-x-4 lg:space-x-8">
                            <CardComponent title="Select a Playlist" imageSrc={img4} imageAlt="Select a Playlist" />
                            <CardComponent title="Select a Song" imageSrc={img2} imageAlt="Select a Song" />
                            <CardComponent title="Let Us Do the Work" imageSrc={img1} imageAlt="Let Us Do the Work" />
                            <CardComponent title="Enjoy Learning!" imageSrc={img3} imageAlt="Enjoy Learning!" />
                        </div>
                    </div>
                </div>
                <div className="playlists w-full md:w-1/3 p-5 md:p-10 flex flex-col items-center text-center">
                    <PlaylistHeader currentView={currentView} />
                    <div className="md:w-2/3 flex text-left justify-center overflow-auto max-h-full">
                        <SpotifyGetPlaylists
                            token={token}
                            currentView={currentView}
                            setCurrentView={setCurrentView}
                        />
                    </div>
                    {currentView === 'tracks' && (
                        <button className="btn btn-primary cursor-none btn-outline" onClick={handleBackToPlaylists}>Back to Playlists</button>
                    )}
                    {currentView === 'topWords' && (
                        <button className="btn btn-primary cursor-none btn-outline" onClick={handleBackToTracks}>Back to Tracks</button>
                    )}
                </div>
            </div>
            </div>
        </>
    );
};

export default Home_Page;