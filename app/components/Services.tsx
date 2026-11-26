import { CoffeeArt } from "./CoffeeArt";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading">
      <div className="container section-head">
        <p className="eyebrow">Services</p>
        <h2 id="services-heading">Two platforms. One clear goal: more customers.</h2>
      </div>

      {/* Facebook */}
      <div className="service service-fb">
        <div className="container service-grid">
          <div className="service-copy">
            <p className="eyebrow eyebrow-lime">Facebook campaigns</p>
            <h3>Put your offer in front of people who are likely to care.</h3>
            <p>
              We build campaigns around your audience, location, and goals, then
              test different offers and ads to see what brings in inquiries and
              sales.
            </p>
            <ul className="tags" aria-label="What's included">
              <li>Audience &amp; location targeting</li>
              <li>Offer and ad testing</li>
              <li>Inquiry &amp; sales tracking</li>
            </ul>
          </div>
          <div className="service-visual" aria-label="Example Facebook ad test">
            <div className="ab">
              <article className="fb-card">
                <span className="ab-label">Ad A</span>
                <CoffeeArt id="fb-a" tone="butter" className="fb-card-art" />
                <div className="fb-card-body">
                  <strong>Free pastry with any large drink</strong>
                  <span className="fb-card-btn">Get offer</span>
                </div>
              </article>
              <article className="fb-card">
                <span className="ab-label">Ad B</span>
                <CoffeeArt id="fb-b" tone="sky" className="fb-card-art" />
                <div className="fb-card-body">
                  <strong>Skip the line: order ahead</strong>
                  <span className="fb-card-btn">Order now</span>
                </div>
              </article>
            </div>
            <ul className="targeting" aria-label="Example targeting">
              <li><span>Audience</span> Local coffee lovers</li>
              <li><span>Location</span> Within 5 miles</li>
              <li><span>Goal</span> Store visits</li>
            </ul>
            <p className="sample-caption sample-caption-left">Sample campaign</p>
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div className="service service-ig">
        <div className="container service-grid service-grid-flip">
          <div className="service-visual ig-visual" aria-label="Example Instagram ad formats">
            <div className="ig-trio">
              <figure className="ig-tile ig-reel">
                <CoffeeArt id="ig-reel" tone="peach" className="ig-art" />
                <span className="ig-play" aria-hidden="true">▶</span>
                <figcaption>Reel</figcaption>
              </figure>
              <figure className="ig-tile ig-story">
                <CoffeeArt id="ig-story" tone="butter" className="ig-art" />
                <span className="ig-sticker">Order ahead</span>
                <figcaption>Story</figcaption>
              </figure>
              <figure className="ig-tile ig-post">
                <CoffeeArt id="ig-post" tone="sage" className="ig-art" />
                <span className="ig-sticker ig-sticker-b">New: oat latte</span>
                <figcaption>Feed ad</figcaption>
              </figure>
            </div>
            <p className="sample-caption sample-caption-left">Sample campaign</p>
          </div>
          <div className="service-copy">
            <p className="eyebrow eyebrow-navy">Instagram campaigns</p>
            <h3>Show people what makes your business worth trying.</h3>
            <p>
              We create Reels, Stories, and feed ads that bring your products or
              services to life and make it easy for interested customers to take
              the next step.
            </p>
            <ul className="tags tags-dark" aria-label="What's included">
              <li>Reels</li>
              <li>Stories</li>
              <li>Feed ads</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
