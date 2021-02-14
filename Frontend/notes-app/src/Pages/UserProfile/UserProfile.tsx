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
import Note from '../../Model/Note';
import _ from 'lodash';
import NoteClient from '../../Client/Note.client';
import ModalHandler, { TypeModal } from '../../Components/Modal/Types';
import NotesList from '../../Components/NotesList';

import ErrorAnimation from '../../Assets/error-animation.json';
import SuccessAnimation from '../../Assets/success-animation.json';
import FullscreenAnimation, { FullscreenAnimationOptions } from '../../Components/FullscreenAnimation';
import NoteModal from '../../Components/Modal/NoteModal';


const initialModalState: ModalHandler = {
    show: false,
    modalType: TypeModal.NONE
}

function UserProfile() {
    const [loggedUser, setLoggedUser] = useState<User>(new User());
    const history = useHistory();
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    const [listNotes, setListNotes] = useState<Array<Note>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [internalLoading, setInternalLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<ModalHandler>(initialModalState);
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);
    const [fullscreenAnimationOptions, setFullscreenAnimationOptions] = useState<FullscreenAnimationOptions>()

    useEffect(() => {
        const userUtil = new UserUtil();

        const user: User | null = userUtil.GetUserFromCache();

        if (_.isEmpty(user)) {
            history.replace("/");

            return;
        }

        setIsLoading(true);

        setLoggedUser(user as User);

        NoteClient.getUserNotes(user!.id).then((listNotes) => {
            setListNotes(listNotes);
            setIsLoading(false);
        }).catch((err) => {
            history.replace("error");
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

    const createNote = (noteTitle: string, noteContent: string) => {
        const userId = loggedUser!.id;

        setInternalLoading(true);

        NoteClient.createNewNote({ noteTitle, noteContent, userId })
            .then((note: Note) => {
                let listNotesUpdated: Array<Note>;

                if (!_.isEmpty(listNotes)) {
                    listNotesUpdated = [...listNotes, note];
                }
                else {
                    listNotesUpdated = new Array<Note>();
                    listNotesUpdated.push(note);
                }
                setListNotes(listNotesUpdated.reverse());

                NoteClient.updateNotesCache(listNotesUpdated, userId);

                setFullscreenAnimationOptions({
                    animation: SuccessAnimation,
                    color: "#5FE378",
                    text: `Sua nota foi adicionada com sucesso!`
                });

                setModal({ ...initialModalState });
            }).catch(() => {
                setFullscreenAnimationOptions({
                    animation: ErrorAnimation,
                    color: "#963041",
                    text: "Ops! Não foi possível adicionar a sua nota :("
                });
            }).finally(() => {
                setInternalLoading(false);
                setShowStatusAnimation(true);
            });
    }

    const onDeleteNoteRequestFinish = (deletedNote: Note) => {
        const updatedListNotes = listNotes.filter((note) => note.id !== deletedNote.id);

        setListNotes([...updatedListNotes]);

        NoteClient.updateNotesCache([...updatedListNotes], loggedUser!.id);
    }

    const onUpdateNoteRequestFinish = (noteToUpdate: Note, updatedNote: Note) => {
        const updatedListNotes = listNotes.map((note) => {
            if (note.id === noteToUpdate.id) {
                return updatedNote;
            }

            return note;
        });

        setListNotes([...updatedListNotes]);

        NoteClient.updateNotesCache([...updatedListNotes], loggedUser!.id);
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
                                    const modalConfig = {
                                        modalType: TypeModal.CREATE,
                                        show: true
                                    };

                                    setModal({ ...modalConfig });
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
                    <NotesList
                        listNotes={listNotes}
                        showTurnBackButton={false}
                        onDeleteNoteRequestFinish={onDeleteNoteRequestFinish}
                        onUpdateNoteRequestFinish={onUpdateNoteRequestFinish}
                        principalContainerId="notes-container"
                    />
                </div>
            )}

            {showStatusAnimation &&
                <FullscreenAnimation
                    options={fullscreenAnimationOptions!}
                    onAnimationCompleted={() => {
                        setShowStatusAnimation(false);
                        setFullscreenAnimationOptions({ animation: "", color: "", text: "" });
                    }} />
            }
            <NoteModal
                key={`createNoteModal___${modal.show}`}
                showModal={modal.show}
                whichModal={TypeModal.CREATE}
                onConfirm={({ note }) => {
                    const { title, content } = note;

                    createNote(title, content);
                }}
                onClose={() => {
                    setModal({ ...initialModalState }); 
                }}
            />

            <Loading isLoading={internalLoading} />

        </>
    );
}

export default UserProfile;