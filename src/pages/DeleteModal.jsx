import React, { useState } from "react";
import Close from "../asset/Close.svg";
import styles from "../styles/DeleteModal.module.css";

const DeleteModal = ({ isOpen, onClose, onDelete, productId, authToken }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(productId, authToken);
      onClose();
    } catch (error) {
      alert("خطا در حذف محصول!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <img src={Close} alt="close icon" />
        <p>آیا از حذف این محصول مطمینید؟</p>
        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.cancelButton}>
            لغو
          </button>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={isDeleting}
          >
            {isDeleting ? "در حال حذف..." : "حذف"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
