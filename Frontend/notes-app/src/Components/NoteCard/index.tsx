import React from 'react';
import Note from '../../Model/Note';
import Separator from '../Separator';
import "./style.css"
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

type Props = {
    note: Note
}

function NoteCard({ note }: Props) {
    const createdAt = dayjs(note.createdAt).format("DD/MM/YYYY");
    
    return (
        <div className="note-card">
            <h1>
                {note.title}
            </h1>
            <Separator color="white" />
            <div className="note-card-content">
                <label>
                    {note.content}
                </label>
            </div>
            <div className="note-card-footer">
                <h5>
                    Criado em: {createdAt}
                </h5>
            </div>
        </div>
    )
}

export default NoteCard;