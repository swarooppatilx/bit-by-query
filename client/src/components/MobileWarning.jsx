import { MdDesktopMac } from "react-icons/md";

const MobileWarning = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <MdDesktopMac className="text-7xl mb-4" />
      <p className="text-2xl text-center font-bold">
        This page is only visible on desktop, not on mobile screens.
      </p>
    </div>
  );
};

export default MobileWarning;