import { useState, useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


export default function EditProfilePopup(props) {

  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
}, [currentUser, props.isOpen]);


  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen = {props.isOpen}
      onClose = {props.onClose}
      buttonText="Сохранить"
      onSubmit = {handleSubmit}
    >
      <input
        type="text"
        className="popup__input popup__input_text_name"
        placeholder="Имя"
        name="userName"
        id="user-name"
        minLength="2"
        maxLength="40"
        required
        value={name || ''}
        onChange={(e) => setName(e.target.value)}
      />
      <span className="name-error popup__form-error"></span>
      <input
        type="text"
        className="popup__input popup__input_text_work"
        placeholder="Род деятельности"
        name="userJob"
        id="user-job"
        minLength="2"
        maxLength="200"
        required
        value={description || ''}
        onChange={(e) => setDescription(e.target.value)}
      />
      <span className="profession-error popup__form-error popup__form-error_pos_under"></span>
    </PopupWithForm>
  )
}