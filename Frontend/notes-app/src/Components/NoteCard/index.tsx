import React from 'react';
import Note from '../../Model/Note';
import dayjs from 'dayjs';
import { motion, useAnimation } from 'framer-motion';

import "dayjs/locale/pt-br";
import "./style.css"
import FooterButton from '../FooterButton';

type Props = {
    note: Note;
    onUpdateButtonClick: () => void
    onRemoveButtonClick: (note: Note) => void
}


function NoteCard({ note, onUpdateButtonClick, onRemoveButtonClick }: Props) {
    const createdAt = dayjs(note.createdAt).format("DD/MM/YYYY");
    const modalAnimationController = useAnimation();

    const onMouseOver = () => {
        modalAnimationController.start({
            scale: 1.03,
            cursor: "pointer",
            boxShadow: "10px 10px 0 rgba(0, 0, 0, 0.2)"
        })
    }

    const onMouseOut = () => {
        modalAnimationController.start({
            scale: 1,
            boxShadow: "none"
        })
    }

    return (
        <motion.div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            animate={modalAnimationController}
            className="note-card">
            <header>
                <h1>
                    {note.title}
                </h1>
                <label>
                    Criado em: {createdAt}
                </label>
            </header>
            <div className="note-card-content">
                <label>
                    {note.content}
                </label>
            </div>
            <div className="note-card-footer">
                <FooterButton
                    onClick={onUpdateButtonClick}
                    color="#2FAD6A"
                    text="Atualizar" />
                <FooterButton
                    onClick={() => onRemoveButtonClick(note)}
                    color="#FA6B5C"
                    text="Remover" />
            </div>
        </motion.div>
    )
}

export default NoteCard;
