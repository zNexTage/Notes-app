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
import StatusModal, { StatusAnimation } from '../../Components/Modal/StatusModal';
import YesNoModal from '../../Components/Modal/YesNoModal';

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
    const [statusAnimation, setStatusAnimation] = useState<StatusAnimation>(StatusAnimation.NO_STATUS);
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

        const queryOptions = {
            query: GET_NOTES,
            variables: {
                idUser: user.id
            }
        }

        const apolloCache = client.readQuery(queryOptions);

        if (!_.isEmpty(apolloCache)) {
            const { NotesByUser } = apolloCache;

            setListNotes(NotesByUser);
            setIsLoading(false);
        }
        else {
            client.query(queryOptions).then((value) => {
                const notes = value.data.NotesByUser;

                setListNotes(notes);
            }).catch((err) => {
                history.replace("error");
            }).finally(() => {
                setIsLoading(false);
            });
        }

        setLoggedUser(user as User);
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
        /*if (isNewNote) {
            createNote(note.title, note.content)
        }*/

        console.log(note, isNewNote);

    }

    const createNote = (noteTitle: string, noteContent: string) => {
        const userId = loggedUser.id;

        setIsLoading(true);

        const ADD_NOTE = gql` 
        mutation CreateNewNote($title:String!, $content:String!, $idUser:Int!) {
            CreateNewNote(newNote:{title: $title, content: $content, idUser: $idUser}) {
              id
              title
              content
              createdAt
            }
          }`;

        client.mutate({
            mutation: ADD_NOTE,
            variables: {
                title: noteTitle,
                content: noteContent,
                idUser: userId
            }
        }).then((value) => {
            const note = value.data.CreateNewNote as Note;

            const listNotesUpdated = [...listNotes, note];

            setListNotes(listNotesUpdated);

            client.writeQuery({
                query: GET_NOTES,
                data: {
                    NotesByUser: listNotesUpdated
                },
                variables: {
                    idUser: userId
                }
            });

            setStatusAnimation(StatusAnimation.SUCCESS);
            setShowModal(Modals.NOTES_MODAL);
        }).catch((err) => {
            setStatusAnimation(StatusAnimation.ERROR);
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
            setShowStatusAnimation(true);
        })
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
                <StatusModal
                    statusAnimation={statusAnimation}
                    onAnimationCompleted={() => setShowStatusAnimation(false)} />}
        </>
    );
}

export default UserProfile;