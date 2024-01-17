import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import SpotifyGetPlaylists from "../components/SpotifyGetPlaylists";
import NavComponent from '../components/NavComponent';
import './Home_Page.css'
import CursorComponent from '../components/CursorComponent';
import img1 from "../assets/img1.svg";
import img2 from "../assets/img2.svg";
import img3 from "../assets/img3.svg";
import img4 from "../assets/img4.svg";
import img5 from "../assets/img5.svg";

const Home_Page = ({ token, logout }) => {
    const headerRef = useRef(null);
    const loginRef = useRef(null);

    return (
        <>  
            <CursorComponent headerRef={headerRef} loginRef={loginRef} />
            <NavComponent token={token} logout={logout}/>
            <div className="App flex flex-col grey-background text-neutral min-h-screen">
            <div className="nav-buffer"></div>
            <div className="flex flex-col md:flex-row">
                <div className="information flex flex-col w-full md:w-2/3">
                    <div className="header-div md:p-10 lg:p-20 lg:pb-4 lg:pt-10 animated-fade-in">
                        <h2 className="text-2xl md:text-4xl lg:text-6xl mb-0 md:mb-4">Learn to Sing Along with</h2>
                        <h1 className="title text-4xl md:text-6xl lg:text-8xl font-bold mb-4">Playlist Polyglot</h1>
                    </div>
                    <div className="instructions md:pl-10 lg:pl-20 md:pr-10 lg:pr-10">
                        <h1 className="text-3xl mb-8">Want to sing your favorite songs from other languages? With Playlist Polyglot, you can!</h1>
                        <div className="cards-div flex flex-auto text-black space-x-4 lg:space-x-8">
                            <div className="card w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110">
                                <figure><img className="p-12" src={img4} alt="Shoes" /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Select a Playlist</h2>
                                </div>
                            </div>
                            <div className="card w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110">
                                <figure><img className="p-8" src={img2} alt="Shoes" /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Select a Language</h2>
                                </div>
                            </div>
                            <div className="card w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110">
                                <figure><img className="p-8" src={img1} alt="Shoes" /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Let Us Do the Work</h2>
                                </div>
                            </div>
                            <div className="card w-1/4 bg-neutral shadow-xl transform transition duration-500 ease-in-out hover:scale-110">
                                <figure><img className="p-12" src={img3} alt="Shoes" /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Enjoy Learning!</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="playlists w-full md:w-1/3 p-5 md:p-10 flex flex-col items-center">
                <div className="playlist-header">
                    <h2 className="title text-2xl">Your Playlists</h2>
                </div>
                <div className="playlist-instructions mb-4">
                    <p className="italic hover:not-italic">Select a playlist to dive in!</p>
                </div>
                <div className="md:w-2/3 flex text-left justify-center overflow-auto max-h-full">
                    <SpotifyGetPlaylists token={token} />
                </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Home_Page;

/* <Link to="/top-songs">
    <button className="btn m-2 p-2">Go to Top Songs Page</button>
</Link> */