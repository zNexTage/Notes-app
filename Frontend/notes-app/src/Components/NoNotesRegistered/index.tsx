import React from 'react';
import Lottie from '../Lottie';
import "./style.css";
import NoNotesRegisteredAnimation from '../../Assets/empty_notes.json';

type Props = {
    animationWidth?:string | number;
}

function NoNotesRegistered({animationWidth}:Props) {
    return (
        <div className="no-notes-registered-container">
            <Lottie
                animationData={NoNotesRegisteredAnimation}
                autoplay
                loop
                width={animationWidth}
            />
            <h2>Sua lista de notas está vazia...</h2>
        </div>
    )
}

export default NoNotesRegistered;