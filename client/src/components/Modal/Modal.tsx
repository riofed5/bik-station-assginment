import "./Modal.css";

type ModalProps = {
  styles: object;
  handleOpenModal: () => void;
  children: JSX.Element;
};

const Modal = ({ styles, handleOpenModal, children }: ModalProps) => {
  return (
    <div id="myModal" className="modal" style={{ ...styles }}>
      <div className="modal-content">
        <span className="close" onClick={handleOpenModal}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
