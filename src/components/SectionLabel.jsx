import { FiCircle } from "react-icons/fi";

export default function SectionLabel({ children }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
        <FiCircle size={15} className="fill-accent text-accent" />
      </div>
      <span className="text-base font-semibold tracking-wide text-accent">
        {children}
      </span>
    </div>
  );
}
