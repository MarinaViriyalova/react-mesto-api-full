import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card(props) {

  const currentUser = useContext(CurrentUserContext);

  return (
    <li className="element">
      {(props.card.owner === currentUser._id) &&
        <button
          type="button"
          className="element__delete-button"
          aria-label="Удалить карточку"
          onClick = {() => props.onCardDelete(props.card)}
        ></button>
      }
      <img
        src = {props.card.link}
        alt = {props.card.name}
        className="element__image"
        onClick = {() => props.onCardClick(props.card)}
      />
      <div className="element__description">
        <h2 className="element__title">{props.card.name}</h2>
        <div className="element__likes">
          <button
            type="button"
            className={`element__like-button ${(props.card.likes.some(i => i._id === currentUser._id)) ? 'element__like-button_active' : ''}`}
            aria-label="Поставить лайк"
            onClick={()=> props.onCardLike(props.card)}
          ></button>
          <span className="element__likes-number">{props.card.likes.length ? props.card.likes.length : ''}</span>
        </div>
      </div>
    </li>
  )
}