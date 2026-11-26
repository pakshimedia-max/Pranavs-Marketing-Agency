import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { MeetingForm } from "./components/MeetingForm";
import { Services } from "./components/Services";
import { StickyCta } from "./components/StickyCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <section id="meeting" className="meeting" aria-labelledby="meeting-heading">
          <div className="container meeting-grid">
            <div className="meeting-main">
              <h2 id="meeting-heading" tabIndex={-1}>Let’s talk about your business.</h2>
              <p className="lead">
                Tell me a little about your business and where I can reach you.
                I’ll follow up personally to find a time to meet.
              </p>
              <MeetingForm />
            </div>
            <ContactSection />
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
