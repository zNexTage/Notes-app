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
import "../UserNotes/style.css";
import _ from 'lodash';
import NoteClient from '../../Client/Note.client';
import UserNotes from '../UserNotes';
import ModalHandler, { TypeModal } from '../../Components/Modal/Types';


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
    const [modal, setModal] = useState<ModalHandler>(initialModalState);

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

                                    setModal({...modalConfig});
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
                    <UserNotes
                        key={`${modal.show}`}
                        showTurnBackButton={false}
                        modalHandler={{
                            modalType: modal.modalType,
                            show: modal.show
                        }}
                        containerId="user-notes-container"
                        onModalClose={() => {
                            setModal({...initialModalState})
                        }}
                        notes={listNotes} />
                </div>
            )}
        </>
    );
}

export default UserProfile;