const steps = [
  {
    title: "Meet with Pranav",
    body: "We talk through your business, your customers, your budget, and what you want your ads to achieve.",
  },
  {
    title: "Build and launch",
    body: "We develop the creative, write the ads, and launch a campaign around your offer.",
  },
  {
    title: "Measure and improve",
    body: "We review the leads, bookings, or purchases the campaign brings in and use those results to guide the next round of ads.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="how" aria-labelledby="how-heading">
      <div className="container">
        <p className="eyebrow">How It Works</p>
        <h2 id="how-heading">Three simple steps, from first call to next round.</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
