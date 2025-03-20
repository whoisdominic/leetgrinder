interface BasicButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
}

export function BasicButton({
  title,
  onClick,
  disabled,
  loading,
  color,
}: BasicButtonProps) {
  return (
    <button
      className={`font-bold px-6 py-4 rounded-md min-w-24 bg-gradient-to-r from-indigo-400 to-cyan-400 hover:bg-gradient-to-bl cursor-pointer focus:outline-none text-gray-900 ${color} active:scale-95 transition-transform duration-150`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}
