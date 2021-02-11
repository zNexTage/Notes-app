import React, { useEffect, useState } from 'react';
import "./style.css";
import Avatar from 'react-avatar';
import Separator from '../../Components/Separator';
import User from '../../Model/User';
import UserUtil from '../../Util/UserUtil';
import { useHistory } from 'react-router-dom';
import Loading from '../../Components/Loading';
import Button from '../../Components/Button';
import Plus from '../../Assets/plus.json'
import Lottie from '../../Components/Lottie';
import NoteCard from '../../Components/NoteCard';
import { gql } from '@apollo/client';
import Note from '../../Model/Note';
import "../UserNotes/style.css";
import client from '../../Api';
import _ from 'lodash';
import NoNotesRegistered from '../../Components/NoNotesRegistered';
import NoteModal, { TypeModal } from '../../Components/Modal/NoteModal';
import StatusAnimation, { FullscreenAnimationOptions } from '../../Components/FullscreenAnimation';
import YesNoModal from '../../Components/Modal/YesNoModal';

import SuccessAnimation from '../../Assets/success-animation.json';
import ErrorAnimation from '../../Assets/error-animation.json';
import NoteClient from '../../Client/Note.client';


const GET_NOTES = gql`
    query NotesByUser($idUser:Int!) {
        NotesByUser(idUser: $idUser){
            id
            title
            content
            createdAt
        }
    }
`;

enum Modals {
    NONE = 0,
    NOTES_MODAL = 1,
    YES_NO_MODAL = 2
}

function UserProfile() {
    const [loggedUser, setLoggedUser] = useState<User>(new User());
    const history = useHistory();
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    const [listNotes, setListNotes] = useState<Array<Note>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<Modals>(Modals.NONE);
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);
    const [fullscreenAnimationOptions, setFullscreenAnimationOptions] = useState<FullscreenAnimationOptions>();
    const [typeModal, setTypeModal] = useState<TypeModal>(TypeModal.CREATE);
    const [noteToUpdate, setNoteToUpdate] = useState<Note>();

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache();

        if (!user) {
            history.replace("/");

            return;
        }

        setIsLoading(true);

        setLoggedUser(user as User);

        NoteClient.getUserNotes(user.id).then((listNotes) => {
            setListNotes(listNotes.reverse());
            setIsLoading(false);
        }).catch(() => {
            history.replace("/");
        });
    }, []);

    function CreateNewNote() {
        return (
            <>
                <Lottie
                    autoplay={playAnimation}
                    loop={false}
                    animationData={Plus}
                    width="40px"
                />
                <label>
                    Nova nota
                </label>
            </>
        )
    }

    const seeNotes = () => {
        history.push("usernotes")
    }

    const logoff = () => {
        new UserUtil().ClearCache();

        history.replace("/")
    }

    const handlerNotes = ({ note, isNewNote }: { note: Note, isNewNote: boolean }) => {
        if (isNewNote) {
            createNote(note.title, note.content)
        }
        else {
            updateNote(note);
        }
    }

    const createNote = (noteTitle: string, noteContent: string) => {
        const userId = loggedUser.id;

        setIsLoading(true);

        NoteClient.createNewNote({ noteTitle, noteContent, userId })
            .then((note: Note) => {
                const listNotesUpdated = [...listNotes, note];

                setListNotes(listNotesUpdated.reverse());

                client.writeQuery({
                    query: GET_NOTES,
                    data: {
                        NotesByUser: listNotesUpdated
                    },
                    variables: {
                        idUser: userId
                    }
                });

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
                setShowModal(Modals.NONE);
            });
    }

    const updateNote = (noteToUpdate: Note) => {
        const userId = loggedUser.id;

        setIsLoading(true);

        NoteClient.updateNote(noteToUpdate.id, {
            noteContent: noteToUpdate.content,
            noteTitle: noteToUpdate.title,
            userId
        }).then((updatedNote) => {
            const updatedListNotes = listNotes.filter((note) => note.id !== noteToUpdate.id);

            updatedListNotes.push(updatedNote);

            setListNotes([...updatedListNotes, updatedNote].reverse());

            NoteClient.updateNotesCache(updatedListNotes, userId);

            setFullscreenAnimationOptions({
                animation: SuccessAnimation,
                color: "#5FE378",
                text: `Sua nota foi atualizada com sucesso!`
            });
        }).catch((err) => {
            setFullscreenAnimationOptions({
                animation: ErrorAnimation,
                color: "#963041",
                text: "Ops! Não foi possível atualizar a sua nota :("
            });
        }).finally(() => {
            setIsLoading(false);
            setShowStatusAnimation(true);
            setShowModal(Modals.NONE);
        });
    }

    return (
        <>
            {isLoading && <Loading isLoading={isLoading} />}
            {!isLoading && (
                <div className="profile-notes-container">
                    <div className="user-profile-info">
                        <Avatar round="50%" textSizeRatio={1.75} size="140" name={`${loggedUser.name} ${loggedUser.lastname}`} src={loggedUser.picture} />
                        <label>
                            <b>
                                {`${loggedUser.name}\n${loggedUser.lastname}`}
                            </b>
                        </label>
                        <Separator color="white" />

                        <div className="create-notes-container">
                            <Button
                                onClick={() => {
                                    setNoteToUpdate(undefined);
                                    setTypeModal(TypeModal.CREATE);
                                    setShowModal(Modals.NOTES_MODAL);
                                }}
                                onMouseOut={() => setPlayAnimation(false)}
                                onMouseOver={() => setPlayAnimation(true)}
                                title={<CreateNewNote />} color="#8854E3" />

                            <Button
                                onClick={seeNotes}
                                title="Ver Notas"
                                color="#FAB064" />

                            <Button
                                onClick={logoff}
                                title="Sair"
                                color="#F04D66" />
                        </div>
                    </div>
                    <div id="notes-container" className="notes-container">
                        {
                            !_.isEmpty(listNotes) ?
                                listNotes.map((note: Note) => (
                                    <NoteCard
                                        onRemoveButtonClick={() => {
                                            setShowModal(Modals.YES_NO_MODAL);
                                        }}
                                        onUpdateButtonClick={() => {
                                            setNoteToUpdate(note);
                                            setTypeModal(TypeModal.UPDATE);
                                            setShowModal(Modals.NOTES_MODAL);
                                        }}
                                        key={`notecard___${note.id}`}
                                        note={note} />
                                ))
                                :
                                <NoNotesRegistered animationWidth="80%" />
                        }
                    </div>
                </div>
            )}

            <NoteModal
                key={`${showModal}`}
                noteToUpdate={noteToUpdate}
                onConfirm={handlerNotes}
                showModal={showModal === Modals.NOTES_MODAL}
                typeModal={typeModal}
                onClose={() => setShowModal(Modals.NONE)} />

            <YesNoModal
                showModal={showModal === Modals.YES_NO_MODAL}
                onYesButtonClick={() => {

                }}
                onNoButtonClick={() => {
                    setShowModal(Modals.NONE);
                }}
            />


            {showStatusAnimation &&
                <StatusAnimation
                    options={fullscreenAnimationOptions!}
                    onAnimationCompleted={() => {
                        setShowStatusAnimation(false)
                        setFullscreenAnimationOptions({ animation: "", color: "", text: "" });
                    }} />}
        </>
    );
}

export default UserProfile;