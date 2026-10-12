import { useState, type CSSProperties } from "react";
import { Plus } from "lucide-react";
import { event, faqs } from "../data/event";
import { ActionLink, SectionHeading } from "../components/UI";

export default function FAQ() {
  const [opened, setOpened] = useState<number | null>(null);
  return (
    <section id="faq" className="section">
      <div className="container faq-grid">
        <div className="faq-intro">
          <SectionHeading title="Pertanyaan umum" />
          <div className="faq-guide" data-reveal="up">
            <ActionLink secondary href={event.links.guide}>
              Baca pedoman
            </ActionLink>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const open = index === opened;
            return (
              <article
                className={`faq-item ${open ? "is-open" : ""}`}
                key={faq.question}
                data-reveal="up"
                style={
                  { "--reveal-delay": `${(index % 3) * 40}ms` } as CSSProperties
                }
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
                      {String(index + 1).padStart(2, "0")}
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
