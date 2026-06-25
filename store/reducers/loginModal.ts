interface ModalState {
    loginModal: boolean;
    modalType?: 'login' | 'register';
}

type ModalAction =
    | { type: 'OPEN_LOGIN_MODAL'; modalType: 'login' | 'register'; }
    | { type: 'CLOSE_LOGIN_MODAL' };


const initialState: ModalState = { loginModal: false, modalType: 'login' };


const actionTypes = {
    OPEN_LOGIN_MODAL: 'OPEN_LOGIN_MODAL',
    CLOSE_LOGIN_MODAL: 'CLOSE_LOGIN_MODAL',
} as const;


export const openLoginModal = (modalType: 'login' | 'register'): ModalAction => ({
    type: actionTypes.OPEN_LOGIN_MODAL,
    modalType,
});

export const closeLoginModal = (): ModalAction => ({
    type: actionTypes.CLOSE_LOGIN_MODAL
});


const loginReducer = (state = initialState, action: ModalAction): ModalState => {
    switch (action.type) {
        case actionTypes.OPEN_LOGIN_MODAL:
            return { ...state, loginModal: true, modalType: action.modalType };
        case actionTypes.CLOSE_LOGIN_MODAL:
            return { ...state, loginModal: false };
        default:
            return state;
    }
};

export default loginReducer;