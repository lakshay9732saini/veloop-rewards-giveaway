import { MessageCircle } from 'lucide-react';
import styles from './FAQ.module.css';
import { faqItems } from '../../data/giveawayData';

export default function FAQ() {
  return (
    <section className={styles.section} id="faq" aria-label="Frequently asked questions">
      <div className="container">
        <div className={styles.inner}>
          {/* Left */}
          <div className={styles.left}>
            <p className="section-label">💬 FAQ</p>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Frequently Asked Questions
            </h2>
            <p className={styles.tagline}>
              Can't find what you're looking for? Our support team is ready to help.
            </p>
            <a href="#" className={styles.supportLink}>
              <MessageCircle size={16} aria-hidden="true" />
              Contact Support
            </a>
          </div>

          {/* Right – accordion */}
          <div className="accordion" id="faqAccordion">
            {faqItems.map((item) => (
              <div className="accordion-item" key={item.id}>
                <h3 className="accordion-header" id={`faqHead-${item.id}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faqBody-${item.id}`}
                    aria-expanded="false"
                    aria-controls={`faqBody-${item.id}`}
                  >
                    {item.question}
                  </button>
                </h3>
                <div
                  id={`faqBody-${item.id}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`faqHead-${item.id}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
