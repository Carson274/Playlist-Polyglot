import React from 'react';
import './NavComponent.css';
import axios from 'axios';
import react_icon from "../assets/react.svg";
import vite_icon from "../assets/vite.svg";
import tailwind_icon from "../assets/tailwind.svg";
import axios_icon from "../assets/axios.svg";
import github_logo from "../assets/github_logo.png";

const NavComponent = () => {
    return (
        <nav className="nav-bar fixed top-0 grey-background text-white z-10 flex flex-row justify-between p-10">
            <div className="icons flex flex-row">
                <img className="w-12 mx-2" src={react_icon} alt="React" />
                <img className="w-12 mx-2" src={tailwind_icon} alt="Tailwind" />
                <img className="w-12 mx-2" src={axios_icon} alt="Axios" />
                <img className="w-12 mx-2" src={vite_icon} alt="Vite" />
            </div>
            <div className="github-logo-and-text flex items-center">
                <a href="https://github.com/Carson274" target="_blank" rel="noopener noreferrer">
                    <img className="w-12 mx-2" src={github_logo} alt="GitHub" />
                </a>
            </div>
        </nav>
    )
}

export default NavComponent;