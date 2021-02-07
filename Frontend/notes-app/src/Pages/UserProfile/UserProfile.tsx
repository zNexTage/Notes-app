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
    const [loggedUser, setLoggedUser] = useState<User>(new User);
    const history = useHistory();
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    const [getNotes, { loading, data }] = useLazyQuery(GET_NOTES);

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache(); 

        if (!user) {
            history.replace("/");

            return;
        }

        setLoggedUser(user as User);
    }, []);

    useEffect(() => {
        getNotes({
            variables: {
                idUser: loggedUser.id
            }
        });
        
    }, [loggedUser]);

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

    return (
        <>
            {loading && <Loading isLoading={loading} />}
            {!loading && (
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
                        </div>
                    </div>
                    <div id="notes-container" className="notes-container">
                        {data && data.NotesByUser && data.NotesByUser.map((note: Note) => (
                            <NoteCard key={`notecard___${note.id}`} note={note} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfile;