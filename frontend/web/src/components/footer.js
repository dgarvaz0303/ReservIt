import "@/styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">

        <div className="footer-left">
          <h3 className="footer-logo">ReservIt</h3>
          <p className="footer-text">
            Reserva, descubre y disfruta de experiencias gastronómicas únicas.
          </p>
        </div>

        <div className="footer-right">
          <p>© 2026 ReservIt</p>
          <p>Todos los derechos reservados</p>
        </div>

      </div>
    </footer>
  );
}