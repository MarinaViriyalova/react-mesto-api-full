export default function InfoTooltip(props) {
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
  
          <div className={`popup__success ${props.isSuccess ? "" : "popup__success_type_unsuccess"}`} ></div>
  
          <h3 className="popup__title popup__title_type_info-tooltip">{`${props.isSuccess ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте еще раз."}`}</h3>
  
        </div>
      </div>
    )
  }