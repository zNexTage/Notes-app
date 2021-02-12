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
import NoteModal from '../../Components/Modal/NoteModal';
import YesNoModal from '../../Components/Modal/YesNoModal';
import FullscreenAnimation, { FullscreenAnimationOptions } from '../../Components/FullscreenAnimation';

import RemoveNoteAnimation from '../../Assets/remove_note.json';
import UpdateNoteAnimation from '../../Assets/update_notes.json';
import ErrorAnimation from '../../Assets/error-animation.json';
import SuccessAnimation from '../../Assets/success-animation.json';
import ModalHandler, { TypeModal } from '../../Components/Modal/Types';

type Props = {
    notes?: Array<Note>;
    containerId?: string;
    showTurnBackButton: boolean;
    modalHandler?: ModalHandler;
    onModalClose?: () => void
}

enum ActionNotes {
    CREATE_NOTE = 1,
    UPDATE_NOTE = 2,
    DELETE_NOTE = 3
}

const initialModalState: ModalHandler = {
    show: false,
    modalType: TypeModal.NONE
}

function UserNotes({ notes, containerId, showTurnBackButton, onModalClose, modalHandler }: Props) {
    const history = useHistory();
    const [loggedUser, setLoggedUser] = useState<User>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listNotes, setListNotes] = useState<Array<Note>>([]);
    const [listNotesAux, setListNotesAux] = useState<Array<Note>>([]);
    const [modal, setModal] = useState<ModalHandler>(modalHandler ? modalHandler : initialModalState);
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

        setLoggedUser(user);

        if (!_.isEmpty(notes)) {
            setListNotes(notes!);
        }
        else {
            setIsLoading(true);
            NoteClient.getUserNotes(user.id)
                .then((notes) => {
                    setListNotes(notes);
                }).catch((err) => {
                    history.replace('error');
                }).finally(() => {
                    setIsLoading(false);
                });
        }

    }, []);

    const handlerNotes = (note: Note, actionNotes: ActionNotes) => {
        switch (actionNotes) {
            case ActionNotes.CREATE_NOTE: {
                createNote(note.title, note.content);
                break;
            }
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

    const createNote = (noteTitle: string, noteContent: string) => {
        const userId = loggedUser!.id;

        setIsLoading(true);

        NoteClient.createNewNote({ noteTitle, noteContent, userId })
            .then((note: Note) => {
                const listNotesUpdated = [...listNotes, note];

                //setListNotes(listNotesUpdated.reverse());
                setListNotesAux(listNotesUpdated.reverse());

                NoteClient.updateNotesCache(listNotesUpdated, userId);

                setFullscreenAnimationOptions({
                    animation: SuccessAnimation,
                    color: "#5FE378",
                    text: `Sua nota foi adicionada com sucesso!`
                });
            }).catch(() => {
                setFullscreenAnimationOptions({
                    animation: ErrorAnimation,
                    color: "#963041",
                    text: "Ops! Não foi possível adicionar a sua nota :("
                });
            }).finally(() => {
                setIsLoading(false);
                setShowStatusAnimation(true);
                setModal({...initialModalState});
            });
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

            //setListNotes([...updatedListNotes]);
            setListNotesAux([...updatedListNotes]);

            NoteClient.updateNotesCache([...updatedListNotes], userId);

            setFullscreenAnimationOptions({
                animation: UpdateNoteAnimation,
                color: "#5FE378",
                text: `Sua nota foi atualizada com sucesso!`,
                width: '50%'
            });

            setModal({...initialModalState});
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

            //setListNotes([...updatedListNotes]);
            setListNotesAux([...updatedListNotes]);

            NoteClient.updateNotesCache([...updatedListNotes], loggedUser!.id);

            setFullscreenAnimationOptions({
                animation: RemoveNoteAnimation,
                color: "#5FE378",
                text: `Sua nota foi removida com sucesso!`,
                animationTime: 3600
            });

            setModal({...initialModalState});
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
            {isLoading && <Loading isLoading={isLoading} />}
            {!isLoading && (
                <div id={containerId} className="user-notes-container">
                    {showTurnBackButton && <Button
                        onClick={() => history.goBack()}
                        title="Voltar"
                        color="#C055C9" />}

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

                                        setModal({ ...modalConfig });
                                    }}
                                    onUpdateButtonClick={() => {
                                        const modalConfig = {
                                            modalType: TypeModal.UPDATE,
                                            show: true
                                        }

                                        setNoteToUpdate(note);

                                        setModal({...modalConfig});
                                    }}
                                    key={`notecard___${note.id}`}
                                    note={note} />
                            ))}
                            {_.isEmpty(listNotes) &&
                                <NoNotesRegistered animationWidth="70%" />
                            }

                            <NoteModal
                                key={`${modal.modalType}`}
                                note={noteToUpdate}
                                whichModal={modal.modalType}
                                onConfirm={({ note, isNewNote }) => {
                                    const actionNote = isNewNote ? ActionNotes.CREATE_NOTE : ActionNotes.UPDATE_NOTE;

                                    handlerNotes(note, actionNote);
                                }}
                                showModal={modal.modalType === TypeModal.CREATE || modal.modalType === TypeModal.UPDATE}
                                onClose={() => {
                                    setNoteToUpdate(undefined);
                                    setModal({...initialModalState});
                                    onModalClose && onModalClose();
                                }} />

                            <YesNoModal
                                showModal={modal.modalType === TypeModal.YES_NO}
                                onYesButtonClick={() => {
                                    handlerNotes(noteToDelete!, ActionNotes.DELETE_NOTE);
                                }}
                                onNoButtonClick={() => {
                                    setNoteToDelete(undefined);
                                    setModal({...initialModalState});
                                }}
                            />

                        </>

                    </div>
                </div>
            )}

            {showStatusAnimation &&
                <FullscreenAnimation
                    options={fullscreenAnimationOptions!}
                    onAnimationStart={() => {
                        setListNotes([...listNotesAux]);
                        setListNotesAux([]);
                    }}
                    onAnimationCompleted={() => {
                        setShowStatusAnimation(false);
                        setFullscreenAnimationOptions({ animation: "", color: "", text: "" });
                    }} />}
        </>
    )
}

export default UserNotes;