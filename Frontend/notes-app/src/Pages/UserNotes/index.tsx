import React, { useEffect, useState } from 'react';
import NoteCard from '../../Components/NoteCard';
import _ from 'lodash';
import Loading from '../../Components/Loading';
import User from '../../Model/User';
import UserUtil from '../../Util/UserUtil';
import { useHistory } from 'react-router-dom';
import "./style.css";
import Button from '../../Components/Button';
import Note from '../../Model/Note';
import NoNotesRegistered from '../../Components/NoNotesRegistered';
import NoteClient from '../../Client/Note.client';
import NoteModal, { TypeModal } from '../../Components/Modal/NoteModal';
import YesNoModal from '../../Components/Modal/YesNoModal';
import Modals from '../../Enum/Modals';
import FullscreenAnimation, { FullscreenAnimationOptions } from '../../Components/FullscreenAnimation';

import RemoveNoteAnimation from '../../Assets/remove_note.json';
import UpdateNoteAnimation from '../../Assets/update_notes.json';
import ErrorAnimation from '../../Assets/error-animation.json';


function UserNotes() {
    const history = useHistory();
    const [loggedUser, setLoggedUser] = useState<User>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listNotes, setListNotes] = useState<Array<Note>>([]);
    const [showModal, setShowModal] = useState<Modals>(Modals.NONE);
    const [noteToUpdate, setNoteToUpdate] = useState<Note>();
    const [noteToDelete, setNoteToDelete] = useState<Note>();
    const [fullscreenAnimationOptions, setFullscreenAnimationOptions] = useState<FullscreenAnimationOptions>();
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache();

        if (!user) {
            history.replace("/");

            return;
        }

        setIsLoading(true);

        setLoggedUser(user);

        NoteClient.getUserNotes(user.id).then((notes) => {
            setListNotes(notes);
        }).catch((err) => {
            history.replace('error');
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handlerNotes = ({ note, isNewNote }: { note: Note, isNewNote: boolean }) => {
        updateNote(note);
    }

    const updateNote = (noteToUpdate: Note) => {
        const userId = loggedUser!.id;

        setIsLoading(true);

        NoteClient.updateNote(noteToUpdate.id, {
            noteContent: noteToUpdate.content,
            noteTitle: noteToUpdate.title,
            createdAt: noteToUpdate.createdAt,
            userId
        }).then((updatedNote) => {
            //Atualiza no array de notas a nota que foi alterada pelo usuário.
            const updatedListNotes = listNotes.map((note) => {
                if (note.id === noteToUpdate.id) {
                    return updatedNote;
                }

                return note;
            });

            setListNotes([...updatedListNotes]);

            NoteClient.updateNotesCache([...updatedListNotes], userId);

            setFullscreenAnimationOptions({
                animation: UpdateNoteAnimation,
                color: "#5FE378",
                text: `Sua nota foi atualizada com sucesso!`,
                width: '50%'
            });

            setShowModal(Modals.NONE);
            setNoteToUpdate(undefined);
        }).catch((err) => {
            setFullscreenAnimationOptions({
                animation: ErrorAnimation,
                color: "#963041",
                text: "Ops! Não foi possível atualizar a sua nota :("
            });
        }).finally(() => {
            setIsLoading(false);
            setShowStatusAnimation(true);
        });
    }

    const deleteNote = (idNote: number) => {
        setIsLoading(true);

        NoteClient.deleteNote(idNote).then(({ id }) => {
            const updatedListNotes = listNotes.filter((note) => note.id !== id);

            setListNotes([...updatedListNotes]);

            NoteClient.updateNotesCache([...updatedListNotes], loggedUser!.id);

            setFullscreenAnimationOptions({
                animation: RemoveNoteAnimation,
                color: "#5FE378",
                text: `Sua nota foi removida com sucesso!`,
                animationTime: 3600
            });

            setShowModal(Modals.NONE);
            setNoteToDelete(undefined);
        }).catch((err) => {
            setFullscreenAnimationOptions({
                animation: ErrorAnimation,
                color: "#963041",
                text: "Ops! Não foi possível remover a sua nota :("
            });
        }).finally(() => {
            setIsLoading(false);
            setShowStatusAnimation(true);
        })
    }

    return (
        <>
            <div className="user-notes-container">
                <Button
                    onClick={() => history.goBack()}
                    title="Voltar"
                    color="#C055C9" />

                <div className="notes-container">
                    {isLoading && <Loading isLoading={isLoading} />}
                    {!isLoading && (
                        <>
                            {!_.isEmpty(listNotes) && listNotes.map((note: Note) => (
                                <NoteCard
                                    onRemoveButtonClick={() => {
                                        setNoteToDelete(note);
                                        setShowModal(Modals.YES_NO_MODAL);
                                    }}
                                    onUpdateButtonClick={() => {
                                        setNoteToUpdate(note);
                                        setShowModal(Modals.NOTES_MODAL);
                                    }}
                                    key={`notecard___${note.id}`}
                                    note={note} />
                            ))}
                            {_.isEmpty(listNotes) &&
                                <NoNotesRegistered />
                            }

                            <NoteModal
                                key={`${showModal}`}
                                noteToUpdate={noteToUpdate}
                                onConfirm={handlerNotes}
                                showModal={showModal === Modals.NOTES_MODAL}
                                typeModal={TypeModal.UPDATE}
                                onClose={() => {
                                    setNoteToUpdate(undefined);
                                    setShowModal(Modals.NONE)
                                }} />

                            <YesNoModal
                                showModal={showModal === Modals.YES_NO_MODAL}
                                onYesButtonClick={() => {
                                    deleteNote(noteToDelete!.id);
                                }}
                                onNoButtonClick={() => {
                                    setNoteToDelete(undefined);
                                    setShowModal(Modals.NONE);
                                }}
                            />

                        </>

                    )}


                </div>
            </div>
            {showStatusAnimation &&
                <FullscreenAnimation
                    options={fullscreenAnimationOptions!}
                    onAnimationCompleted={() => {
                        setShowStatusAnimation(false)
                        setFullscreenAnimationOptions({ animation: "", color: "", text: "" });
                    }} />}
        </>
    )
}

export default UserNotes;