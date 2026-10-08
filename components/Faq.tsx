import { FAQ } from "@/data/faq";

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="h-faq">
      <div className="wrap">
        <h2 id="h-faq">FAQ</h2>
        <div className="faq" id="faqList">
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
        </div>
      </div>
    </section>
  );
}
