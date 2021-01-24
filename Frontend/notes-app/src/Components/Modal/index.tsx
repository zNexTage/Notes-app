import React from 'react' 
import Modal from 'react-bootstrap/Modal'

type Props = {
    title: string
    body: Array<JSX.Element>
    footer: JSX.Element
    isVisible: boolean
}


function DefaultModal({ title, body, footer, isVisible }: Props) {
    const { Body, Header, Title, Footer } = Modal;
    return (
        <div>

        </div>
    )
}

export default DefaultModal;