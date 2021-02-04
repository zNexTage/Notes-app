import React, { useState, useEffect } from 'react';
import LottiePlayer from 'lottie-web';

type Props = {
    id?: string;
    loop: boolean
    autoplay: boolean
    animationData: any
    width?: string | number
}

function Lottie({ loop, autoplay, animationData, id, width = "100%" }: Props) {
    const [animationDiv, setAnimationDiv] = useState<HTMLDivElement>();

    useEffect(() => {
        LottiePlayer.loadAnimation({
            container: animationDiv as Element,
            renderer: "svg",
            loop,
            autoplay,
            animationData,
        });
    }, [animationDiv])

    return (
        <div id={id} style={{ width }} ref={(ele) => setAnimationDiv(ele!)}></div>
    );
}

export default Lottie;