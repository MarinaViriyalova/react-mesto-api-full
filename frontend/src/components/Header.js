import { Route, Switch, Link } from 'react-router-dom';


function Header({ onSignOut, userData }) {

  return (
    <header className="header">
      <div className="header__logo"></div>
      <Switch>
        <Route exact path="/">
          <div className="header__user-email-logout">
            <p className="header__user-email">{userData.email}</p>
            <Link to="login" className="header__logout-link" onClick = {onSignOut}>Выйти</Link>
          </div>
        </Route>
        <Route path="/register">
          <Link to="login" className="header__login-link">Войти</Link>
        </Route>
        <Route path="/login">
          <Link to="register" className="header__login-link">Регистрация</Link>
        </Route>
      </Switch>
    </header>
  )
}

export default Header;
