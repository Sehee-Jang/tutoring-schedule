const TutorButton = ({ selected, children, ...props }) => (
  <button
    {...props}
    className={`rounded-lg border px-4 py-2 font-medium text-sm ${
      selected
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

export default TutorButton;
