import { CoffeeArt } from "./CoffeeArt";
import { MeetingLink } from "./MeetingLink";

function StoryAd() {
  return (
    <div className="ad ad-story" aria-label="Sample Instagram Story ad">
      <CoffeeArt id="hero-story" tone="peach" className="ad-art" />
      <div className="story-top">
        <span className="avatar" aria-hidden="true">J</span>
        <span className="story-meta">
          <strong>Juniper Lane Coffee</strong>
          <small>Sponsored</small>
        </span>
      </div>
      <div className="story-bars" aria-hidden="true"><i /><i /><i /></div>
      <div className="story-bottom">
        <p className="story-line">Your afternoon pickup.</p>
        <span className="story-cta">Order now</span>
      </div>
    </div>
  );
}

function FeedAd() {
  return (
    <div className="ad ad-feed" aria-label="Sample Facebook feed ad">
      <div className="feed-head">
        <span className="avatar" aria-hidden="true">J</span>
        <span className="story-meta">
          <strong>Juniper Lane Coffee</strong>
          <small>Sponsored · Public</small>
        </span>
      </div>
      <p className="feed-text">Cold, smooth, and ready when you are. Stop in on your way home.</p>
      <CoffeeArt id="hero-feed" tone="sage" className="feed-art" />
      <div className="feed-foot">
        <span>
          <small>juniperlanecoffee.example</small>
          <strong>Iced coffee, made fresh</strong>
        </span>
        <span className="feed-btn">View menu</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>
            Get your business <span className="hl">seen.</span> Give customers a
            reason to buy.
          </h1>
          <p className="lead">
            We plan, create, and manage Facebook and Instagram ads that
            introduce your business to new customers and give them a clear next
            step, whether that’s placing an order, booking a service, or
            visiting your store.
          </p>
          <div className="hero-actions" id="hero-actions">
            <MeetingLink className="btn btn-lime btn-lg">Request a Meeting</MeetingLink>
            <a href="#services" className="text-link">Explore our services <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className="hero-art">
          <div className="mock-frame">
            <div className="mock-stage">
              <StoryAd />
              <FeedAd />
            </div>
          </div>
          <p className="sample-caption">Sample campaign</p>
        </div>
      </div>
    </section>
  );
}
