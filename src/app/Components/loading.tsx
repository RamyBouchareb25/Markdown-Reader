import { InfinitySpin } from "react-loader-spinner";

const LoadingComponent = () => {
  return (
    <main className="grid h-screen w-screen place-items-center">
      <InfinitySpin color="#000" />
    </main>
  );
};

export default LoadingComponent;
