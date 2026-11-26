import { MeetingLink } from "./MeetingLink";
import { Wordmark } from "./Header";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Wordmark />
        <nav aria-label="Footer" className="footer-nav">
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
          <MeetingLink>Request a Meeting</MeetingLink>
        </nav>
        <p className="fine">
          © {new Date().getFullYear()} Pranavs Marketing Agency. Sample ads are
          fictional illustrations.
        </p>
      </div>
    </footer>
  );
}
