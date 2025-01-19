import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import { startTime, endTime } from "./config/date";

function CountDown() {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [message, setMessage] = useState("");
  const [showStartButton, setShowStartButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (now < startTime) {
        setTimeRemaining(startTime - now);
        setMessage("Get Ready, the Competition Begins Soon!");
        setShowStartButton(false);
      } else if (now >= startTime && now < endTime) {
        setTimeRemaining(endTime - now);
        setMessage("Competition is Live!");
        setShowStartButton(true);
      } else {
        clearInterval(interval);
        setMessage("Times Up!");
        setShowStartButton(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeRemaining);

  return (
    <div className="w-full h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="w-full md:w-1/2 bg-gray-900 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-6">{message}</h2>
        {timeRemaining >= 0 && (
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-gray-300">
                {days.toString().padStart(2, "0")}
              </div>
              <div className="text-lg text-gray-500">Days</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-gray-300">
                {hours.toString().padStart(2, "0")}
              </div>
              <div className="text-lg text-gray-500">Hours</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-gray-300">
                {minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-lg text-gray-500">Minutes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-gray-300">
                {seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-lg text-gray-500">Seconds</div>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-4">
          {showStartButton && (
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
              onClick={() => navigate("/home")}
            >
              Start
            </button>
          )}
          {!showStartButton && (
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
              onClick={() => setShowModal(true)}
            >
              Instructions
            </button>
          )}
        </div>
      </div>

      {/* Instructions Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default CountDown;
