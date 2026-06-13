"use client";

type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function ChoiceButton({ label, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="choice-btn"
    >
      {label}
      <style>{`
        .choice-btn {
          display: block;
          width: 100%;
          max-width: 320px;
          padding: 14px 24px;
          margin: 6px auto;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          color: var(--ink-dim);
          background: transparent;
          border: 1px solid rgba(232, 230, 223, 0.2);
          cursor: pointer;
          text-align: left;
          transition: color 0.3s, border-color 0.3s, background 0.3s;
        }
        .choice-btn:hover:not(:disabled) {
          color: var(--ink);
          border-color: var(--accent);
          background: rgba(205, 178, 122, 0.07);
        }
        .choice-btn:disabled {
          opacity: 0.35;
          cursor: default;
        }
      `}</style>
    </button>
  );
}

