import "../App.css";
import { useNavigate } from "react-router-dom";
export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen  ">
      <h1 className="text-8xl font-black text-gray-200 drop-shadow-[0_0_0.3rem_#ffffff70] mt-48">
        Titan Trainer
      </h1>
      <p className="mt-4 text-lg font-semibold text-gray-300">
        🔥 Meet Titan Trainer – The Ultimate AI Personal Trainer! 🔥
      </p>
      <button
        onClick={() => navigate("/get-started")}
        className="mt-40 px-20 py-5 bg-gray-900 font-semibold rounded-md hover:bg-blue-700 transition text-lg"
      >
        Get Started 💪
      </button>
    </div>
  );
};
