enum TypeModal {
    NONE = 0, CREATE = 1, UPDATE = 2, YES_NO = 3
}

type ModalHandler = {
    show: boolean;
    modalType: TypeModal
}

export default ModalHandler;

export {
    TypeModal
}

