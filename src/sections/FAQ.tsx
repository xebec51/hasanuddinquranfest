import { Plus } from "lucide-react";
import { faqs } from "../data/event";
import { SectionHeading } from "../components/UI";
export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container faq-grid" data-reveal>
        <SectionHeading
          label="PERTANYAAN UMUM"
          title={
            <>
              Masih ada
              <br />
              <em>pertanyaan?</em>
            </>
          }
        >
          Temukan jawaban sebelum memulai perjalananmu.
        </SectionHeading>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details name="hqf-faq" key={faq.question}>
              <summary>
                <span className="faq-index">0{index + 1}</span>
                <span>{faq.question}</span>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
