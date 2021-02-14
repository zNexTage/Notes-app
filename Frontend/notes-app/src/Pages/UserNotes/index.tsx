import React, { useEffect, useState } from 'react';
import Loading from '../../Components/Loading';
import User from '../../Model/User';
import UserUtil from '../../Util/UserUtil';
import { useHistory } from 'react-router-dom';
import "./style.css";
import Note from '../../Model/Note';
import NoteClient from '../../Client/Note.client';
import FullscreenAnimation, { FullscreenAnimationOptions } from '../../Components/FullscreenAnimation';

import NotesList from '../../Components/NotesList';

function UserNotes() {
    const history = useHistory();
    const [loggedUser, setLoggedUser] = useState<User>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listNotes, setListNotes] = useState<Array<Note>>([]);
    const [fullscreenAnimationOptions, setFullscreenAnimationOptions] = useState<FullscreenAnimationOptions>();
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache();

        if (!user) {
            history.replace("/");

            return;
        }

        setLoggedUser(user);

        setIsLoading(true);

        NoteClient.getUserNotes(user.id)
            .then((notes) => {
                setListNotes(notes);
            }).catch((err) => {
                history.replace('error');
            }).finally(() => {
                setIsLoading(false);
            });

    }, []);

    
    const onUpdateNoteRequestFinish = (noteToUpdate: Note, updatedNote: Note) => {
        //Atualiza no array de notas a nota que foi alterada pelo usuário.
        const updatedListNotes = listNotes.map((note) => {
            if (note.id === noteToUpdate.id) {
                return updatedNote;
            }

            return note;
        });

        setListNotes([...updatedListNotes]);

        NoteClient.updateNotesCache([...updatedListNotes], loggedUser!.id);
    }

    const onDeleteNoteRequestFinish = (deletedNote: Note) => {
        const updatedListNotes = listNotes.filter((note) => note.id !== deletedNote.id);

        setListNotes([...updatedListNotes]);

        NoteClient.updateNotesCache([...updatedListNotes], loggedUser!.id);
    }

    return (
        <>
            {isLoading && <Loading isLoading={isLoading} />}
            {!isLoading && (
                <NotesList
                    listNotes={listNotes}
                    onUpdateNoteRequestFinish={onUpdateNoteRequestFinish}
                    onDeleteNoteRequestFinish={onDeleteNoteRequestFinish}
                    showTurnBackButton={true}
                />
            )}

            {showStatusAnimation &&
                <FullscreenAnimation
                    options={fullscreenAnimationOptions!}
                    onAnimationCompleted={() => {
                        setShowStatusAnimation(false);
                        setFullscreenAnimationOptions({ animation: "", color: "", text: "" });
                    }} />}
        </>
    )
}

export default UserNotes;