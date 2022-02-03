import { Link } from 'react-router-dom';
import { useState } from 'react';


export default function Register({ onRegisterSubmit }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegisterSubmit(password, email);
  }

  return (
    <div className="register">
      <h3 className="register__title">Регистрация</h3>
      <form className={`register__form`} onSubmit = {handleSubmit}>

        <input
          type="email"
          className="register__input"
          placeholder="E-mail"
          name="email"
          id="email"
          required
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="register__input"
          placeholder="Пароль"
          name="password"
          id="password"
          required
          value={password || ''}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="register__submit"
          aria-label="Отправить данные"
        >Зарегистрироваться</button>

      </form>
      <div className="register__login">
        <p>Уже зарегистрированы?&nbsp;</p>
        <Link to="login" className="register__login-link">Войти</Link>
      </div>
    </div>
  )
}