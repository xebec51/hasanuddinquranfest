import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "../data/event";
import { SectionHeading } from "../components/UI";

export default function FAQ() {
  const [opened, setOpened] = useState<number | null>(null);
  return (
    <section id="faq" className="section">
      <div className="container faq-grid">
        <div data-reveal>
          <SectionHeading title="Pertanyaan umum" />
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((faq, index) => {
            const open = index === opened;
            return (
              <article
                className={`faq-item ${open ? "is-open" : ""}`}
                key={faq.question}
              >
                <h3>
                  <button
                    id={`faq-question-${index}`}
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpened(open ? null : index)}
                  >
                    <span className="faq-index" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                    <Plus size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  className="faq-panel"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  aria-hidden={!open}
                  inert={!open}
                >
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
