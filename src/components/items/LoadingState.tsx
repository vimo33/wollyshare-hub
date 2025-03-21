
const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="h-80 rounded-2xl bg-gray-100 animate-pulse"></div>
      ))}
    </div>
  );
};

export default LoadingState;
