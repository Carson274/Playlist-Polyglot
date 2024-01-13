import { Link } from 'react-router-dom';
import SpotifyGetPlaylists from "../components/SpotifyGetPlaylists/SpotifyGetPlaylists";
import NavComponent from '../components/NavComponent';

const Home_Page = ({ token, logout }) => {
    return (
        <div className="App flex flex-col md:flex-row min-h-screen grey-background text-white">
            <div className="flex flex-col w-full md:w-7/10">
                <div className="header-div p-5 md:p-10 lg:p-20">
                    <h1 className="text-4xl ">Discover the World of Music with Playlist Polyglot</h1>
                </div>
                <div className="instructions p-5 md:p-10">
                    <h2>Instructions:</h2>
                    <p>1. Click on the button below to go to the Top Songs Page</p>
                    <p>2. Click on the button below to logout</p>
                </div>
                <Link to="/top-songs">
                    <button className="btn m-2 p-2">Go to Top Songs Page</button>
                </Link>
                <button onClick={logout} className=" btn m-2 p-2">Logout</button>
            </div>
            <div className="w-full md:w-3/10 p-5 md:p-10">
                <div className="playlist-header">
                    <h2 className="text-2xl">Your Playlists</h2>
                </div>
                <div className="playlist-instructions">
                    <p>Click on a playlist to continue.</p>
                </div>
                <div>
                    <SpotifyGetPlaylists token={token} />
                </div>
            </div>
        </div>
    );
};

export default Home_Page;
