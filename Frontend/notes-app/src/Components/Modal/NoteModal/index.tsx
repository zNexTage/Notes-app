import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Note from '../../../Model/Note';
import Button from '../../Button';
import Input from '../../Input';
import Textarea from '../../Input/Textarea';

enum TypeModal {
    CREATE = 1, UPDATE = 2
}

type Props = {
    showModal: boolean
    onClose: () => void;
    onConfirm: ({ note, isNewNote }: { note: Note, isNewNote: boolean }) => void;
    typeModal: TypeModal;
    noteToUpdate?: Note;
}

const modalConfig = {
    [TypeModal.CREATE]: {
        title: "Nova Nota",
        btnTitle: "Criar :)"
    },
    [TypeModal.UPDATE]: {
        title: "Atualizar Nota",
        btnTitle: "Atualizar :)"
    }
}

function NoteModal({ showModal, onClose, onConfirm, typeModal, noteToUpdate }: Props) {
        
    const [noteTitle, setNoteTitle] = useState<string>("");
    const [noteContent, setNoteContent] = useState<string>("");

    useEffect(()=>{
        if(noteToUpdate){
            setNoteTitle(noteToUpdate.title);
            setNoteContent(noteToUpdate.content);
        }
    }, []);

    
    return (
        <Modal backdrop="static" size="lg" centered show={showModal}>
            <Modal.Header className="notemodal-header">
                <h1>
                    {modalConfig[typeModal].title}
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
                        let isNewNote = typeModal === TypeModal.CREATE;

                        if (!isNewNote) {
                            noteToMutate.id = noteToUpdate!.id;
                            noteToMutate.createdAt = noteToUpdate!.createdAt;
                        }

                        onConfirm({
                            note: noteToMutate,
                            isNewNote
                        });
                    }}
                    title={modalConfig[typeModal].btnTitle}
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

export {
    TypeModal
}