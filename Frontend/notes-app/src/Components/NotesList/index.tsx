import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../Loading';
import _ from 'lodash';
import NoteCard from '../NoteCard';
import Note from '../../Model/Note';
import ModalHandler, { TypeModal } from '../Modal/Types';
import NoNotesRegistered from '../NoNotesRegistered';
import NoteModal from '../Modal/NoteModal';
import YesNoModal from '../Modal/YesNoModal';
import FullscreenAnimation, { FullscreenAnimationOptions } from '../FullscreenAnimation';
import UserUtil from '../../Util/UserUtil';
import User from '../../Model/User';
import NoteClient from '../../Client/Note.client';
import RemoveNoteAnimation from '../../Assets/remove_note.json';
import UpdateNoteAnimation from '../../Assets/update_notes.json';
import ErrorAnimation from '../../Assets/error-animation.json';
import './style.css';
import Button from '../Button';

type Props = {
    showTurnBackButton: boolean;
    principalContainerId?: string;
    listNotes: Array<Note>;
    onUpdateNoteRequestFinish: (noteToUpdate:Note, updatedNote: Note) => void;
    onDeleteNoteRequestFinish: (deletedNote: Note) => void;
}

const initalStateModal: ModalHandler = {
    modalType: TypeModal.NONE,
    show: false
}

enum ActionNotes {
    UPDATE_NOTE = 1,
    DELETE_NOTE = 2
}

function NotesList({ showTurnBackButton, principalContainerId, listNotes, onUpdateNoteRequestFinish, onDeleteNoteRequestFinish }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [noteToDelete, setNoteToDelete] = useState<Note>();
    const [modalHandler, setModalHandler] = useState<ModalHandler>({ ...initalStateModal });
    const [noteToUpdate, setNoteToUpdate] = useState<Note>();
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);
    const [fullscreenAnimationOptions, setFullscreenAnimationOptions] = useState<FullscreenAnimationOptions>();
    const [loggedUser, setLoggedUser] = useState<User>();

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache();

        if (!user) {
            history.replace("/");

            return;
        }

        setLoggedUser(user);
    }, []);

    const handlerNotes = (note: Note, actionNotes: ActionNotes) => {
        switch (actionNotes) {
            case ActionNotes.UPDATE_NOTE: {
                updateNote(note);
                break;
            }
            case ActionNotes.DELETE_NOTE: {
                deleteNote(note.id);
                break;
            }
        }
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
            setFullscreenAnimationOptions({
                animation: UpdateNoteAnimation,
                color: "#5FE378",
                text: `Sua nota foi atualizada com sucesso!`,
                width: '50%'
            });

            setModalHandler({ ...initalStateModal });
            setNoteToUpdate(undefined);

            onUpdateNoteRequestFinish(noteToUpdate, updatedNote);
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

        NoteClient.deleteNote(idNote).then((deletedNote) => { 
            setFullscreenAnimationOptions({
                animation: RemoveNoteAnimation,
                color: "#5FE378",
                text: `Sua nota foi removida com sucesso!`,
                animationTime: 3600
            });

            setModalHandler({ ...initalStateModal });
            setNoteToDelete(undefined);
            onDeleteNoteRequestFinish(deletedNote);
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
            {isLoading && <Loading isLoading={isLoading} />}
            {!isLoading && (
                <div id={principalContainerId} className="user-notes-container">
                    {showTurnBackButton &&
                        <Button
                            onClick={() => history.goBack()}
                            title="Voltar"
                            color="#C055C9" />
                    }

                    <div className="notes-container">
                        <>
                            {!_.isEmpty(listNotes) && listNotes.map((note: Note) => (
                                <NoteCard
                                    onRemoveButtonClick={() => {
                                        setNoteToDelete(note);
                                        const modalConfig = {
                                            modalType: TypeModal.YES_NO,
                                            show: true
                                        }

                                        setModalHandler({ ...modalConfig });
                                    }}
                                    onUpdateButtonClick={() => {
                                        const modalConfig = {
                                            modalType: TypeModal.UPDATE,
                                            show: true
                                        }

                                        setNoteToUpdate(note);

                                        setModalHandler({ ...modalConfig });
                                    }}
                                    key={`notecard___${note.id}`}
                                    note={note} />
                            ))}
                            {_.isEmpty(listNotes) &&
                                <NoNotesRegistered animationWidth="70%" />
                            }

                            <NoteModal
                                key={`${modalHandler.modalType}`}
                                note={noteToUpdate}
                                whichModal={modalHandler.modalType}
                                onConfirm={({ note }) => {
                                    handlerNotes(note, ActionNotes.UPDATE_NOTE);
                                }}
                                showModal={modalHandler.modalType === TypeModal.UPDATE}
                                onClose={() => {
                                    setNoteToUpdate(undefined);
                                    setModalHandler({ ...initalStateModal });
                                }} />

                            <YesNoModal
                                showModal={modalHandler.modalType === TypeModal.YES_NO}
                                onYesButtonClick={() => {
                                    handlerNotes(noteToDelete!, ActionNotes.DELETE_NOTE);
                                }}
                                onNoButtonClick={() => {
                                    setNoteToDelete(undefined);
                                    setModalHandler({ ...initalStateModal });
                                }}
                            />

                        </>

                    </div>
                </div>
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

export default NotesList;