import Modal from "../../Modal.jsx";
import { useState } from "react";

const UserSignModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSignIn = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    localStorage.setItem("user", trimmedName);
    onClose();
  };

  return (
    <Modal>
      <div className="flex flex-col gap-2 w-[400px] max-w-full rounded-2xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-2">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-white">
              Merhaba! Lütfen adınızı giriniz
            </h1>
          </header>
          <input
            className="border border-gray-300 rounded-md p-2 cursor-pointer bg-transparent text-white"
            type="text"
            placeholder="Örn: Eren"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-white text-black rounded-md p-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleSignIn}
            disabled={!name.trim()}
          >
            Boarda Eriş!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserSignModal;
