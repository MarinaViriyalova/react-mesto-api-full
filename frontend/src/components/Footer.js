function Footer() {
  const currentDate = new Date()
    return (
    <footer className="footer">
      <p className="footer__author">&copy; {currentDate.getFullYear()}. Mesto-React. Марина Вириялова</p>
    </footer>
    )
  }
  
  export default Footer;