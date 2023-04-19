import React from 'react';
import styles from './Modal.module.css';

/**
 * A modal interface
 * @param {hide, children} param0 chidren: elements, hide: handleHide
 * @returns Modal Interface
 */
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
