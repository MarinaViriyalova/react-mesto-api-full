export default function CardsSection(props) {
    return (
      <section>
        <ul className="elements">
          {props.children}
        </ul>
      </section>
    )
  }