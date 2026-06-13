"use client";

type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function ChoiceButton({ label, onClick, disabled }: Props) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="choice-btn">
      {label}
    </button>
  );
}
