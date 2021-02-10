import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import './style.css';

type Props = {
    text: string
    color: string;
    scale?: number;
    onClick: () => void
}

function FooterButton({ text, color, onClick, scale = 1.04 }: Props) {
    const footerButtonsAnimation = useAnimation();

    const onMouseOver = () => {
        footerButtonsAnimation.start({
            scale
        })
    }

    const onMouseOut = () => {
        footerButtonsAnimation.start({
            scale: 1
        })
    }

    return (
        <motion.button
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            animate={footerButtonsAnimation}
            className="footer-button" style={{ backgroundColor: color }}>
            {text}
        </motion.button>
    )
}

export default FooterButton;