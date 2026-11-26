import { MeetingLink } from "./MeetingLink";

export function Wordmark() {
  return (
    <a href="#top" className="wordmark" aria-label="Pranavs Marketing Agency, back to top">
      <span className="wordmark-dot" aria-hidden="true" />
      <span>Pranavs Marketing Agency</span>
    </a>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Wordmark />
        <nav className="nav" aria-label="Main">
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
        <MeetingLink className="btn btn-lime btn-sm">Request a Meeting</MeetingLink>
      </div>
    </header>
  );
}
