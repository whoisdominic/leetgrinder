interface BasicButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
}

interface RadioButtonProps extends BasicButtonProps {
  selected?: boolean;
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

export function RadioButton({
  title,
  onClick,
  disabled,
  loading,
  color,
  selected,
}: RadioButtonProps) {
  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
      <div
        className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${
          selected ? "border-2 border-cyan-600" : ""
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-cyan-500"></div>}
      </div>
      <span className="ml-2 text-white font-medium">{title}</span>
    </div>
  );
}
