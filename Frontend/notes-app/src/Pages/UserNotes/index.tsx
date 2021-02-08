import React, { useEffect, useState } from 'react';
import NoteCard from '../../Components/NoteCard';
import _ from 'lodash';
import { gql } from '@apollo/client';
import Loading from '../../Components/Loading';
import User from '../../Model/User';
import UserUtil from '../../Util/UserUtil';
import { useHistory } from 'react-router-dom';
import "./style.css";
import Button from '../../Components/Button';
import client from '../../Api';
import Note from '../../Model/Note';
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

function UserNotes() {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listNotes, setNotes] = useState<Array<Note>>([]);

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
        }).then((response) => {
            setNotes(response.data.NotesByUser);
        }).catch((err) => {
            console.log(err);
        }).finally(()=>{
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="notes-container notes-container-align">
            {isLoading && <Loading isLoading={isLoading} />}
            {!isLoading && (
                <>
                    <Button
                        onClick={() => history.goBack()}
                        title="Voltar"
                        color="#C055C9" />
                    <br />
                    {!_.isEmpty(listNotes) && listNotes.map((note: Note) => (
                        <NoteCard key={`notecard___${note.id}`} note={note} />
                    ))}
                    {_.isEmpty(listNotes) &&
                        <NoNotesRegistered />
                    }
                </>
            )}
        </div>
    )
}

export default UserNotes;