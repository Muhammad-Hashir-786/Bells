import { Link } from "react-router-dom";
import { RingMark, IconLeaf, IconReturn, IconTruck } from "../components/Icons.jsx";
import "./About.css";

const milestones = [
  { year: "2011", text: "Started as a market stall of seconds-quality ceramics from a co-op in Cornwall." },
  { year: "2015", text: "Opened our first storefront and began working directly with six founding makers." },
  { year: "2019", text: "Launched Bells online, shipping small-batch goods across the country." },
  { year: "2024", text: "Now partnering with 120+ independent workshops across three continents." },
];

const values = [
  { icon: <IconLeaf />, title: "Materials that age well", text: "Solid wood, natural fibre, glazed stoneware — nothing that needs replacing in a year." },
  { icon: <IconTruck />, title: "Small runs, shipped fast", text: "We hold less stock on purpose. It keeps every maker on the list an active one." },
  { icon: <IconReturn />, title: "Easy to return, easier to love", text: "Try it in your space for 30 days. If it's not right, we'll take it back — no interrogation." },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="eyebrow">Our story</span>
            <h1>We buy from people, not catalogs.</h1>
            <p>
              Bells started as a market stall selling seconds-quality ceramics that a small
              Cornwall co-op couldn't move. Fourteen years later, the principle hasn't changed:
              we visit the workshop, meet the person at the wheel or the loom, and only then
              decide whether it belongs in your home.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
            alt="A potter's hands shaping stoneware on a wheel in a sunlit studio"
          />
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head section-head--center">
            <RingMark className="ring-mark ring-mark--center" />
            <h2>What we won't compromise on</h2>
          </div>
          <div className="about-values">
            {values.map((v) => (
              <div className="about-value" key={v.title}>
                {v.icon}
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-timeline-wrap">
          <div className="section-head">
            <h2>Fourteen years, in short</h2>
          </div>
          <ol className="about-timeline">
            {milestones.map((m) => (
              <li key={m.year}>
                <span className="about-timeline-year">{m.year}</span>
                <span className="about-timeline-text">{m.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--surface about-makers">
        <div className="container about-makers-grid">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900&auto=format&fit=crop"
            alt="A weaver working at a wooden loom with wool thread"
          />
          <div>
            <span className="eyebrow">The makers</span>
            <h2>120 workshops, one standard</h2>
            <p>
              Every maker we work with signs their pieces, sets their own prices, and can tell you
              exactly where the raw material came from. We don't chase the lowest cost — we chase
              the workshop that's still standing in five years.
            </p>
            <Link to="/shop" className="btn btn--navy">Shop their work</Link>
          </div>
        </div>
      </section>

      <section className="section about-cta">
        <div className="container about-cta-inner">
          <h2>Have a question before you buy?</h2>
          <p>Our team answers every message personally — no ticket numbers, no bots.</p>
          <Link to="/contact" className="btn btn--primary">Get in touch</Link>
        </div>
      </section>
    </div>
  );
}
