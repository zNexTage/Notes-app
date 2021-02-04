import React from 'react';
import Lottie from '../Lottie';
import LoadingAnimation from '../../Assets/loading.json';
import "./style.css"

type Props = {
    isLoading: boolean
}

function Loading({ isLoading }: Props) {
    return (
        <>
            { isLoading && <div className="loading-container">
                <Lottie
                    id="loading-animation"
                    autoplay
                    loop
                    animationData={LoadingAnimation}
                    width="20%"
                />
            </div>
            }
        </>
    )
}

export default Loading;