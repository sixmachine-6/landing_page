import { FiChevronRight, FiChevronUp } from "react-icons/fi";

export default function FaqItem({ index, question, answer, isOpen, onToggle }) {
  const buttonId = `faq-q-${index}`;
  const panelId = `faq-a-${index}`;

  return (
    <div className="border-b border-ink/10 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent sm:py-7"
        >
          <span
            className={`text-lg font-medium leading-snug transition-colors duration-300 sm:text-xl ${
              isOpen ? "text-accent" : "text-ink group-hover:text-accent"
            }`}
          >
            {index + 1}. {question}
          </span>

          {/* circle button: green with an up arrow when open, a plain arrow when closed */}
          <span
            aria-hidden="true"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all duration-300 sm:h-12 sm:w-12 ${
              isOpen
                ? "bg-brand text-white"
                : "bg-transparent text-ink group-hover:bg-ink/10"
            }`}
          >
            {isOpen ? <FiChevronUp size={22} /> : <FiChevronRight size={22} />}
          </span>
        </button>
      </h3>

      {/* answer: opens and closes smoothly */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-7 pr-4 text-base leading-8 text-muted sm:pr-16 sm:text-lg">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
