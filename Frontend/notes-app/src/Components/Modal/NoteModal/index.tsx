import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Button';
import Input from '../../Input';
import Textarea from '../../Input/Textarea';

type Props = {
    showModal: boolean
    onClose: () => void;
    onConfirm: () => void;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
}

function NoteModal({ showModal, onClose, onConfirm, onTitleChange, onDescriptionChange }: Props) {
    return (
        <Modal backdrop="static" size="lg" centered show={showModal}>
            <Modal.Header className="notemodal-header">
                <h1>
                    Nova Nota
            </h1>
            </Modal.Header>
            <Modal.Body className="notemodal-body">
                <Input onChange={(e) => onTitleChange(e.target.value)} placeholder="Título" type="text" />

                <Textarea placeholder="Descrição" onChange={(e) => onDescriptionChange(e.target.value)} />
            </Modal.Body>
            <Modal.Footer className="notemodal-footer">
                <Button
                    onClick={onConfirm}
                    title="Criar :)"
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