const PrimaryButton = ({ children, ...props }) => (
  <button
    {...props}
    className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 text-sm'
  >
    {children}
  </button>
);

export default PrimaryButton;
