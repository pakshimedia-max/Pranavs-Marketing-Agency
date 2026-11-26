export function ContactSection() {
  return (
    <aside id="contact" className="contact-card" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact Pranavs Marketing Agency</h2>
      <p>
        Prefer to talk directly? Call either number or email us to discuss your
        Facebook and Instagram campaign.
      </p>
      <ul className="contact-list">
        <li>
          <a href="tel:+15624411972">
            <span className="contact-ico" aria-hidden="true">☎</span>
            562-441-1972
          </a>
        </li>
        <li>
          <a href="tel:+19132298607">
            <span className="contact-ico" aria-hidden="true">☎</span>
            913-229-8607
          </a>
        </li>
        <li>
          <a href="mailto:pranavsairam2005@gmail.com">
            <span className="contact-ico" aria-hidden="true">✉</span>
            pranavsairam2005@gmail.com
          </a>
        </li>
      </ul>
    </aside>
  );
}
