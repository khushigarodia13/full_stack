export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-all shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}