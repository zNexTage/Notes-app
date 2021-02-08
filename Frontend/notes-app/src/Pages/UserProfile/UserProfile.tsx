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
import { gql, useLazyQuery } from '@apollo/client';
import Note from '../../Model/Note';
import "../UserNotes/style.css";
import client from '../../Api';
import _ from 'lodash';
import NoNotesRegistered from '../../Components/NoNotesRegistered';

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
    const [isQuerySuccessful, setIsQuerySuccessful] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache();

        if (!user) {
            history.replace("/");

            return;
        }

        setIsLoading(true);

        client.query({
            query: GET_NOTES,
            variables: {
                idUser: user.id
            }
        }).then((value) => {
            const notes = value.data.NotesByUser;

            setListNotes(notes);
            setIsQuerySuccessful(true);
        }).catch((err) => {
            setIsQuerySuccessful(false);
        }).finally(() => {
            setIsLoading(false);
        })

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

    function logoff(){
        new UserUtil().ClearCache();

        history.replace("/")
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
        </>
    );
}

export default UserProfile;