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
import NoteModal from '../../Components/Modal/NoteModal';
import StatusModal, { StatusAnimation } from '../../Components/Modal/StatusModal';

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

function UserProfile() {
    const [loggedUser, setLoggedUser] = useState<User>(new User());
    const history = useHistory();
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    const [listNotes, setListNotes] = useState<Array<Note>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
    const [noteTitle, setNoteTitle] = useState<string>("");
    const [noteDescription, setNoteDescription] = useState<string>("");
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);
    const [statusAnimation, setStatusAnimation] = useState<StatusAnimation>(StatusAnimation.NO_STATUS);

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

    function seeNotes() {
        history.push("usernotes")
    }

    function logoff() {
        new UserUtil().ClearCache();

        history.replace("/")
    }

    function handlerTitle(title: string): void {
        setNoteTitle(title);
    }

    function handlerDescription(description: string): void {
        setNoteDescription(description);
    }

    function createNote() {
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
                content: noteDescription,
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
            setShowNotesModal(false);
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
                                onClick={() => setShowNotesModal(true)}
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
                                    <NoteCard key={`notecard___${note.id}`} note={note} />
                                ))
                                :
                                <NoNotesRegistered animationWidth="80%" />
                        }
                    </div>
                </div>
            )}

            <NoteModal
                onConfirm={createNote}
                onTitleChange={handlerTitle}
                onDescriptionChange={handlerDescription}
                showModal={showNotesModal}
                onClose={() => setShowNotesModal(false)} />


            {showStatusAnimation &&
                <StatusModal
                    statusAnimation={statusAnimation}
                    onAnimationCompleted={() => setShowStatusAnimation(false)} />}
        </>
    );
}

export default UserProfile;