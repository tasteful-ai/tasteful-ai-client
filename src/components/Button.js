const Button = ({ onClick, children }) => {
    return (
      <button
        onClick={onClick}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
        {children}
      </button>
    );
  };
  
  export default Button;
  