import Profile from './Profile';
import Card from './Card';
import CardsSection from './CardsSection';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useContext } from 'react';


export default function Main(props) {

  const currentUser = useContext(CurrentUserContext);

  return (
    <main>
      <Profile
        currentUser = {currentUser}
        {...props}
      />
      <CardsSection>
        {props.cards.map(card => {
            return (<Card
              key = {card._id}
              card = {card}
              onCardDelete = {props.onCardDelete}
              onCardClick = {props.onCardClick}
              onCardLike = {props.onCardLike}

            />)
          })
        }
      </CardsSection>
    </main>
  )
}