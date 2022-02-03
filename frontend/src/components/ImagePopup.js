export default function ImagePopup(props) {
    return (
      <div className={`popup popup_type_pic ${props.isOpen ? 'popup_opened' : ''}`} 
      onClick = {props.onClose}>
        <figure className="popup__pic-container" onClick = {(e) => e.stopPropagation()}>
          <button
          type="button"
          className="popup__close"
          aria-label="Закрыть окно"
          onClick={props.onClose}></button>
          
          <img src={props.data.link} alt={props.data.name} className="popup__pic"/>
          <figcaption className="popup__pic-title">{props.data.name}</figcaption>
        </figure>
      </div>
    )
  }
