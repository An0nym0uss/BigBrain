import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ hide, children }) => {
  return (
    <>
      <div className={styles.backdrop} onClick={hide} />
      <dialog open className={styles.modal}>
        {children}
      </dialog>
    </>
  );
}

export default Modal;
