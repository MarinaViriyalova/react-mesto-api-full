import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';


export default function EditAvatarPopup(props) {

  const inputAvatarUrlRef = useRef();

  useEffect(() => {
    inputAvatarUrlRef.current.value = '';
  }, [props.isOpen])

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: inputAvatarUrlRef.current.value
    });
  }


  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose = {props.onClose}
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <input
        ref={inputAvatarUrlRef}
        type="url"
        className="popup__input popup__input_value_link"
        placeholder="Ссылка на аватар"
        name="avatarLink"
        id="avatar-link"
        required/>
      <span className="avatar-link-error popup__form-error-msg"></span>
    </PopupWithForm>
  )
}
