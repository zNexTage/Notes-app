import React from 'react';
import { Modal } from 'react-bootstrap';
import FooterButton from '../../FooterButton';
import './style.css';

type Props = {
    showModal: boolean
    onYesButtonClick: () => void;
    onNoButtonClick: () => void;
}

function YesNoModal({ showModal, onNoButtonClick, onYesButtonClick }: Props) {
    return (
        <Modal backdrop="static" size="lg" centered show={showModal}>
            <Modal.Header className="notemodal-header">
                <h1>
                    Remover nota
                </h1>
            </Modal.Header>
            <Modal.Body className="notemodal-body yes-no-modal-body">
                <h1>
                    Deseja remover essa nota?
                </h1>
            </Modal.Body>
            <Modal.Footer className="notemodal-footer yes-no-footer">
                <FooterButton
                    scale={1.005}
                    text="Sim"
                    color="#2FAD6A"
                    onClick={onYesButtonClick}
                />
                <FooterButton
                    scale={1.005}
                    text="Não"
                    color="#FA6B5C"
                    onClick={onNoButtonClick}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default YesNoModal;