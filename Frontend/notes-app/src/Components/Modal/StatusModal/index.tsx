import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SuccessAnimation from '../../../Assets/lf20_pJo4Hp.json';
import ErrorAnimation from '../../../Assets/error-animation.json';
import './style.css';
import Lottie from '../../Lottie';

enum StatusAnimation {
    SUCCESS = 1,
    ERROR = 2,
    NO_STATUS = 3
}

type Props = {
    onAnimationCompleted: () => void;
    statusAnimation: StatusAnimation;
}

function StatusModal({ onAnimationCompleted, statusAnimation }: Props) {
    const animationControl = useAnimation();
    const [removeFromDom, setRemoveFromDom] = useState<boolean>(false)

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
    }, 2100);

    let statusColorClass;

    const isSuccess = statusAnimation === StatusAnimation.SUCCESS;

    if (isSuccess) {
        statusColorClass = "success-modal-bg";
    }
    else {
        statusColorClass = "error-modal-bg";
    }

    return (
        <>
            {
                !removeFromDom &&
                <motion.div
                    animate={animationControl}
                    className={`status-modal-container ${statusColorClass}`}>
                    <Lottie
                        animationData={
                            isSuccess ?
                                SuccessAnimation :
                                ErrorAnimation
                        }
                        width="30%"
                        autoplay
                        loop={false} />
                    <label>
                        {isSuccess ? "Nota criada com sucesso!" : "Ops! Não foi possível criar a nota"}
                    </label>
                </motion.div>
            }
        </>
    )
}

export default StatusModal;

export {
    StatusAnimation
}