import { gql } from "@apollo/client";
import client from "../Api";
import Note from "../Model/Note";
import _ from 'lodash';

type NewNote = {
    noteTitle: string,
    noteContent: string,
    userId: number
}

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

class NoteClient {
    static getUserNotes(userId: number) {
        const queryOptions = {
            query: GET_NOTES,
            variables: {
                idUser: userId
            }
        }

        return new Promise((resolve: (listNotes: Array<Note>) => void, reject) => {
            const apolloCache = client.readQuery(queryOptions);

            if (!_.isEmpty(apolloCache)) {
                const { NotesByUser }: { NotesByUser: Array<Note> } = apolloCache;

                resolve(NotesByUser);

                return;
            }
            else {
                client.query(queryOptions)
                    .then((value) => {
                        const { NotesByUser }: { NotesByUser: Array<Note> } = value.data;

                        resolve(NotesByUser);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            }
        })
    }
    static createNewNote({ noteContent, noteTitle, userId }: NewNote) {
        const ADD_NOTE = gql` 
        mutation CreateNewNote($title:String!, $content:String!, $idUser:Int!) {
            CreateNewNote(newNote:{title: $title, content: $content, idUser: $idUser}) {
              id
              title
              content
              createdAt
            }
          }`;

        return new Promise((resolve: (note: Note) => void, reject) => {
            client.mutate({
                mutation: ADD_NOTE,
                variables: {
                    title: noteTitle,
                    content: noteContent,
                    idUser: userId
                }
            }).then((value) => {
                const note = value.data.CreateNewNote as Note;

                resolve(note);
            })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    static updateNote(idNote: number, { noteContent, noteTitle, userId }: NewNote) {
        const UPDATE_NOTE = gql` 
        mutation UpdateNote($idNote:Int!, $title:String!, $content:String!, $idUser:Int!) {
            UpdateNote(idNote:$idNote, newNote:{title: $title, content: $content, idUser: $idUser}) {
              id
              title
              content
              createdAt
            }
          }`;

        return new Promise((resolve: (note: Note) => void, reject) => {
            client.mutate({
                mutation: UPDATE_NOTE,
                variables: {
                    idNote,
                    title: noteTitle,
                    content: noteContent,
                    idUser: userId
                }
            }).then((value) => {
                const note = value.data.UpdateNote as Note;

                resolve(note);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    static updateNotesCache(listNotes: Array<Note>, userId: number) {
        client.writeQuery({
            query: GET_NOTES,
            data: {
                NotesByUser: listNotes
            },
            variables: {
                idUser: userId
            }
        });
    }
}

export default NoteClient;