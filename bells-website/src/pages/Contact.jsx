import { useState } from "react";
import { IconMail, IconPhone, IconPin } from "../components/Icons.jsx";
import "./Contact.css";

const FAQS = [
  { q: "How long does shipping take?", a: "Orders ship within 2 business days and arrive in 3–6 business days via standard delivery. Free on orders over $75." },
  { q: "What's your return policy?", a: "Return any unused item within 30 days of delivery for a full refund. We'll email a prepaid label — no questions asked." },
  { q: "Do you ship internationally?", a: "Currently we ship within the continental US and Canada. We're working on expanding — join the newsletter for updates." },
  { q: "Can I visit a showroom?", a: "Yes — our Portland showroom is open Tuesday through Saturday. See the address below, or reach out to book a private viewing." },
];

const initialForm = { name: "", email: "", topic: "General question", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "That email doesn't look right.";
    if (!form.message.trim()) next.message = "Tell us a little about what you need.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>We're glad to hear from you.</h1>
          <p>Questions about an order, a piece, or the trade program — a real person reads every message.</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-grid">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {submitted && (
              <div className="form-success" role="status">
                Thanks — your message is in. We reply within one business day.
              </div>
            )}

            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
              </div>

              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="topic">What's this about?</label>
              <select id="topic" value={form.topic} onChange={(e) => update("topic", e.target.value)}>
                <option>General question</option>
                <option>Order status</option>
                <option>Returns &amp; exchanges</option>
                <option>Trade &amp; wholesale</option>
                <option>Press</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && <span className="field-error" id="message-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn--primary">Send message</button>
          </form>

          <aside className="contact-info">
            <div className="contact-info-card">
              <IconPin />
              <div>
                <h3>Showroom</h3>
                <p>412 Alder Street<br />Portland, OR 97205</p>
              </div>
            </div>
            <div className="contact-info-card">
              <IconMail />
              <div>
                <h3>Email</h3>
                <p>hello@bellshome.example</p>
              </div>
            </div>
            <div className="contact-info-card">
              <IconPhone />
              <div>
                <h3>Phone</h3>
                <p>(503) 555-0148<br />Mon–Fri, 9am–5pm PT</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container contact-faq-wrap">
          <div className="section-head">
            <h2>Frequently asked</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div className="faq-item" key={item.q}>
                <button
                  className="faq-question"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {item.q}
                  <span className="faq-toggle">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <p className="faq-answer">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
