import '../index.css';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import { api } from '../utils/Api';
import * as apiAuth from '../utils/apiAuth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

function App() {

  const history = useHistory();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isCardDeleteConfirmOpen, setIsCardDeleteConfirmOpen] = useState({isOpen: false, cardToDelete: {}});
  const [selectedCard, setSelectedCard] = useState({isOpen: false, data: {}})
  const [currentUser, setCurrentUser] = useState({});
  const [userData, setUserData] = useState({});
  const [cards, setCards] = useState([]);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState({isOpen: false, isSuccess: true});
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    tokenCheck()
  }, [])

  useEffect(() => {
    Promise.all([
      api.getInitialCards(),
      api.getUserInfo()
    ])
      .then(([cards, user]) => {
        setCards(cards);
        setCurrentUser(user);
      })
      .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    const closeByEscape = (event) => {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', closeByEscape)
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [])

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardDeleteConfirmOpen({isOpen: false, cardToDelete: {}});
    setSelectedCard({isOpen: false, data: selectedCard.data}); 
    setIsInfoTooltipPopupOpen({isOpen: false});
  }

  function handleCardClick(data) {
    setSelectedCard(
      {
        isOpen: true,
        data: {
          link: data.link,
          name: data.name
        }
      }
    )
  }

  function handleUpdateUser(data) {
    api.editUserInfo(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  function handleUpdateAvatar(data) {
    api.editUserAvatar(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(error => console.log(error));
  }

  function handleCardDelete(e, card) {
    e.preventDefault();
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards => cards.filter(c => c._id !== card._id));
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  function handleAddPlaceSubmit(data) {
    api.postCard(data)
    .then(res => {
      setCards([res, ...cards]);
      closeAllPopups();
    })
    .catch(error => console.log(error))
  }

  function handleCardDeleteConfirm(card) {
    setIsCardDeleteConfirmOpen({isOpen: true, cardToDelete: {...card}})
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      apiAuth.getContent(jwt)
        .then(res => {
          setIsLoggedIn(true);
          setUserData({...res.data})
          history.push("/")
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      history.push("/login")
    }
  }

  function signOut() {
    localStorage.removeItem('jwt');
    history.push('/login');
  }

  function handleRegisterSubmit(password, email) {
    apiAuth.register(password, email)
      .then(res => {
        setIsInfoTooltipPopupOpen({isOpen: true, isSuccess: true})
        history.push("/login")
      })
      .catch(error => {
        console.log(error);
        setIsInfoTooltipPopupOpen({isOpen: true, isSuccess: false})
      })
  }

  function handleLoginSubmit(password, email) {
    apiAuth.authorize(password, email)
      .then(res => {
        tokenCheck()
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="page">
      <div className="page__content">
        <CurrentUserContext.Provider value = {currentUser}>

          <Header onSignOut = {signOut} userData = {userData}/>

          <Switch>

            <ProtectedRoute
              exact path = "/"
              loggedIn = {isLoggedIn}
              component = {Main}
                onEditProfile = {() => setIsEditProfilePopupOpen(true)}
                onEditAvatar = {() => setIsEditAvatarPopupOpen(true)}
                onAddPlace = {() => setIsAddPlacePopupOpen(true)}
                onCardLike = {handleCardLike}
                onCardDelete = {handleCardDeleteConfirm}
                onCardClick = {handleCardClick}
                cards = {cards}
            />

            <Route path="/login">
              <Login onLoginSubmit = {handleLoginSubmit}/>
            </Route>

            <Route path="/register">
              <Register onRegisterSubmit = {handleRegisterSubmit}/>
            </Route>

          </Switch>

          <Footer />

          <EditProfilePopup
            isOpen = {isEditProfilePopupOpen}
            onClose = {closeAllPopups}
            onUpdateUser = {handleUpdateUser}
            onOvelayClick = {closeAllPopups}
          />

          <EditAvatarPopup
            isOpen = {isEditAvatarPopupOpen}
            onClose = {closeAllPopups}
            onUpdateAvatar = {handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen = {isAddPlacePopupOpen}
            onClose = {closeAllPopups}
            onAddPlace = {handleAddPlaceSubmit}
          />

          <PopupWithForm
            name="delete-card"
            title="Вы уверены?"
            isOpen = {isCardDeleteConfirmOpen.isOpen}
            onClose = {closeAllPopups}
            buttonText="Да"
            onSubmit = {(e) => {handleCardDelete(e, isCardDeleteConfirmOpen.cardToDelete)}}
          />

          <ImagePopup
            {...selectedCard}
            onClose = {closeAllPopups}
          />

          <InfoTooltip
            isOpen = {isInfoTooltipPopupOpen.isOpen}
            isSuccess = {isInfoTooltipPopupOpen.isSuccess}
            name="info-tooltip"
            onClose = {closeAllPopups}
          />

        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;