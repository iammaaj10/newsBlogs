import React, { useState } from "react";

const GenerateResponse = () => {
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = () => {
    setResponse("This is the generated response!");
    setShowModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert("Copied to clipboard!");
  };

  const handleClose = () => {
    setShowModal(false);
    setResponse("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Generate
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Generated Response</h2>
            <p className="text-gray-700 mb-6">{response}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCopy}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Copy
              </button>
              <button
                onClick={handleClose}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateResponse;
