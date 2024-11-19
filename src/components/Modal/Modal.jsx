import { useEffect} from 'react';
import Close from '../Icons/Close/Close';
import s from "./Modal.module.scss";

function Modal({ children, onModal }) {
 
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
    window.removeEventListener('keydown', handleKeyDown);
    } 
    });

    const handleKeyDown = e => {
        if (e.code === 'Escape') {
            onModal();
            }
         };
   
         const handleBackdropClick = e => {
           if (e.currentTarget === e.target) {
               onModal();
            }
            };

  return (
    <div onClick={handleBackdropClick} className={s.backdrop}>
      <div className={s.modal}>
        <div className={s.container}>
            <div className={s.content}>
            <button type='button' className={s.button} onClick={onModal}><Close width={"25"} height={"25"}/></button>
        {children}
           </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;