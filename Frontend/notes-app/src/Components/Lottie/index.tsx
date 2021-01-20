import React, { useState, useEffect } from 'react';
import LottiePlayer from 'lottie-web';

type Props = {
    id?:string;
    loop:boolean
    autoplay:boolean
    animationData:any
    width?: string | number
}

function Lottie({loop, autoplay, animationData, id, width}:Props) {
    const [animationDiv, setAnimationDiv] = useState<HTMLDivElement>();

    useEffect(() => {
        const animationItem = LottiePlayer.loadAnimation({
            container: animationDiv as Element,
            renderer: "svg",
            loop,
            autoplay,
            animationData, 
        });
    }, [animationDiv])

    return (
        <div id={id} style={{width: width ? width : "100%"}} ref={(ele) => setAnimationDiv(ele!)}></div>
    );
}

export default Lottie;