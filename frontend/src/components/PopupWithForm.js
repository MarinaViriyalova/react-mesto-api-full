  export default function PopupWithForm(props) {
    return (
      <div
        className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_opened' : ''}`}
        onClick = {props.onClose}
      >
        <div className="popup__container" onClick = {(e) => e.stopPropagation()}>
          <button
            type="button"
            className="popup__close"
            aria-label="Закрыть окно"
            onClick={props.onClose}
          ></button>
          <h3 className="popup__title">{props.title}</h3>
          <form
            className={`popup__form popup__form_type_${props.name}`}
            method="POST"
            name={props.name}
            onSubmit={props.onSubmit}
          >
            {props.children}
            <button
              type="submit"
              className="popup__submit"
              aria-label="Отправить данные"
            >{props.buttonText}</button>
          </form>
        </div>
      </div>
    )
  }