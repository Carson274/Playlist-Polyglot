import React, { useEffect, useState } from 'react';
import './CursorComponent.css';
import { motion } from 'framer-motion'

const CursorComponent = ({ headerRef, loginRef }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState("default");
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    useEffect(() => {
        const mouseMove = e => {
            // console.log(e.clientX, e.clientY);
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', mouseMove);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
        };
    }, []);

    useEffect(() => {
        const textEnter = () => {
            if (!isButtonClicked) {
                setCursorVariant("text");
            }
        };
        const textLeave = () => {
            if (!isButtonClicked) {
                setCursorVariant("default");
            }
        };

        const headerElement = headerRef.current;
        const loginElement = loginRef.current;
    
        if (headerElement) {
            headerElement.addEventListener('mouseenter', textEnter);
            headerElement.addEventListener('mouseleave', textLeave);
        }
    
        if (loginElement) {
            loginElement.addEventListener('mouseenter', textEnter);
            loginElement.addEventListener('mouseleave', textLeave);
        }
    
        return () => {
            if (headerElement) {
                headerElement.removeEventListener('mouseenter', textEnter);
                headerElement.removeEventListener('mouseleave', textLeave);
            }
    
            if (loginElement) {
                loginElement.removeEventListener('mouseenter', textEnter);
                loginElement.removeEventListener('mouseleave', textLeave);
            }
        };
    }, [headerRef, loginRef, isButtonClicked]);

    useEffect(() => {
        const buttonClick = () => setIsButtonClicked(true);
    
        const loginElement = loginRef.current;
    
        if (loginElement) {
            loginElement.addEventListener('mousedown', buttonClick);
        }
    
        return () => {
            if (loginElement) {
                loginElement.removeEventListener('mousedown', buttonClick);
            }
        };
    }, [loginRef]);

    useEffect(() => {
        if (isButtonClicked) {
            setCursorVariant('click');
            setTimeout(() => {

            }, 1000);
        } else {
            setCursorVariant('default');
        }
    }, [isButtonClicked]);

    const variants = {
        default: {
            height: 8,
            width: 8,
            backgroundColor: "#1DB954",
            mixBlendMode: "normal",
            left: `${mousePosition.x - 4}px`, 
            top: `${mousePosition.y - 4}px`
        },
        text: {
            height: 80,
            width: 80,
            backgroundColor: "#1DB954",
            mixBlendMode: "difference",
            left: `${mousePosition.x - 40}px`, 
            top: `${mousePosition.y - 40}px`
        },
        click: {
            height: 4000,
            width: 4000,
            backgroundColor: "#1DB954",
            mixBlendMode: "normal",
            left: `${mousePosition.x - 2000}px`, 
            top: `${mousePosition.y - 2000}px`
        }
    };

    return (
        <motion.div 
            className="cursor" 
            style={{ 
                left: `${mousePosition.x - 4}px`, 
                top: `${mousePosition.y - 4}px`
            }} 
            variants={variants} 
            animate={cursorVariant}
            transition={{ type: "tween", duration: isButtonClicked ? 2.00 : 0.10 }}
        />
    );
};

export default CursorComponent;