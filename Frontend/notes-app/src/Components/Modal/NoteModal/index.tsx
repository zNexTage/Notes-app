import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Note from '../../../Model/Note';
import Button from '../../Button';
import Input from '../../Input';
import Textarea from '../../Input/Textarea';
import { TypeModal } from '../Types';

type Props = {
    showModal: boolean
    onClose?: () => void;
    onConfirm?: ({ note, isNewNote }: { note: Note, isNewNote: boolean }) => void;
    whichModal: TypeModal;
    note?: Note;
}

function NoteModal({ showModal, onClose, onConfirm, whichModal, note }: Props) {

    const [noteTitle, setNoteTitle] = useState<string>("");
    const [noteContent, setNoteContent] = useState<string>("");

    useEffect(() => {
        if (note) {
            setNoteTitle(note.title);
            setNoteContent(note.content);
        }
    }, []);

    const defineTextsOfModal = (typeModal: TypeModal) => {
        let title, btnTitle;
        switch (typeModal) {
            case TypeModal.CREATE: {
                title = "Nova Nota";
                btnTitle = "Criar :)";

                break;
            }
            case TypeModal.UPDATE: {
                title = "Atualizar Nota";
                btnTitle = "Atualizar :)"

                break;
            }

            default: {
                title = "";
                btnTitle = ""
            }
        }

        return {
            title, btnTitle
        }
    }

    const { title, btnTitle } = defineTextsOfModal(whichModal);

    return (
        <Modal backdrop="static" size="lg" centered show={showModal}>
            <Modal.Header className="notemodal-header">
                <h1>
                    {title}
                </h1>
            </Modal.Header>
            <Modal.Body className="notemodal-body">
                <Input
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Título"
                    type="text" />

                <Textarea
                    value={noteContent}
                    placeholder="Descrição"
                    onChange={(e) => setNoteContent(e.target.value)} />
            </Modal.Body>
            <Modal.Footer className="notemodal-footer">
                <Button
                    onClick={() => {
                        const noteToMutate = new Note(noteTitle, noteContent);
                        let isNewNote = whichModal === TypeModal.CREATE;

                        if (!isNewNote) {
                            noteToMutate.id = note!.id;
                            noteToMutate.createdAt = note!.createdAt;
                        }

                        onConfirm && onConfirm({
                            note: noteToMutate,
                            isNewNote
                        });
                    }}
                    title={btnTitle}
                    color="#49E367" />

                <Button
                    onClick={onClose}
                    title="Sair :|"
                    color="#E35F73" />
            </Modal.Footer>
        </Modal>
    )
}

export default NoteModal;

