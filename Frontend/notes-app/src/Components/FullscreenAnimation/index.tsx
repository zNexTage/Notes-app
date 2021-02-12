import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './style.css';
import Lottie from '../Lottie';

type FullscreenAnimationOptions = {
    animation: any;
    color: string;
    text: string;
    animationTime?: number;
    width?: string | number;
}

type Props = {
    onAnimationCompleted: () => void;
    options: FullscreenAnimationOptions
}

function FullscreenAnimation({ onAnimationCompleted, options }: Props) {
    const animationControl = useAnimation();
    const [removeFromDom, setRemoveFromDom] = useState<boolean>(false)
    const { animation, color, text, animationTime, width } = options;

    useEffect(() => {
        animationControl.start({
            opacity: 1,
            transition: { duration: 1 }
        });
    }, []);

    const endAnimation = setTimeout(() => {
        animationControl.start({
            opacity: 0,
            transition: { duration: 1 }
        }).then(() => {
            setRemoveFromDom(true);
            onAnimationCompleted();
        });

        clearTimeout(endAnimation);
    }, animationTime ? animationTime : 2100);

    return (
        <>
            {
                !removeFromDom &&
                <motion.div
                    animate={animationControl}
                    style={{ backgroundColor: color }}
                    className={`status-modal-container`}>
                    <Lottie
                        animationData={animation}
                        width={width ? width : "30%"}
                        autoplay
                        loop={false} />
                    <label>
                        {text}
                    </label>
                </motion.div>
            }
        </>
    )
}

export default FullscreenAnimation;

export type {
    FullscreenAnimationOptions
}