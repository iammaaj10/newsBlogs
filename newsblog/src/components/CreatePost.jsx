import React, { useState } from "react";
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import { FaRobot } from "react-icons/fa";
import axios from "axios";
import { BLOG_API_END_POINT } from "../utils/constant";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleRefresh, getisActive } from "../redux/blogsSlics";
import profile1 from "../assets/profile.png"; 

const AI_API_END_POINT = "http://localhost:8080/api/ai/ask";
Modal.setAppElement("#root");

const CreatePost = ({ isDarkMode }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResponse, setAIResponse] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.blogs);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!description.trim() && !image) {
      return toast.error("Please provide either a description or an image.");
    }

    try {
      const payload = {
        description: description.trim(),
        id: user._id,
        image: image || "",
      };

      const res = await axios.post(`${BLOG_API_END_POINT}create`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(toggleRefresh());
        toast.success(res.data.message);
        setDescription("");
        setImage(null);
      } else {
        toast.error(res.data.message || "Failed to create post.");
      }
    } catch (error) {
      console.error("Post Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAIResponse = async () => {
    if (!prompt.trim()) {
      return toast.error("Please enter a prompt for AI.");
    }

    try {
      setLoadingAI(true);
      const res = await axios.post(
        AI_API_END_POINT,
        { question: prompt },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoadingAI(false);

      if (res.data?.result) {
        setDescription(res.data.result);
        setAIResponse(res.data.result);
        setShowModal(true);
        toast.success("AI response received.");
        setPrompt("");
        setShowPromptInput(false);
      } else {
        toast.error("AI did not return a valid response.");
      }
    } catch (error) {
      setLoadingAI(false);
      console.error("AI Error:", error);
      toast.error(error.response?.data?.message || "Failed to get AI response.");
    }
  };

  const toggleTab = (tab) => {
    dispatch(getisActive(tab === "news"));
  };

  return (
    <div className={`w-full rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
    }`}>
      {/* Tabs */}
      <div className="flex items-center">
        <div
          onClick={() => toggleTab("news")}
          className={`text-center w-full px-6 py-5 cursor-pointer transition-all duration-300 rounded-tl-xl ${
            isActive 
              ? (isDarkMode 
                  ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b-4 border-orange-500' 
                  : 'bg-gradient-to-r from-orange-50 to-red-50 border-b-4 border-orange-500')
              : (isDarkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-gray-50')
          }`}
        >
          <h1 className={`font-bold text-lg transition-all duration-300 ${
            isActive 
              ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
              : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
          }`}>
            News For You
          </h1>
        </div>
        <div
          onClick={() => toggleTab("following")}
          className={`text-center w-full px-6 py-5 cursor-pointer transition-all duration-300 rounded-tr-xl ${
            !isActive 
              ? (isDarkMode 
                  ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b-4 border-orange-500' 
                  : 'bg-gradient-to-r from-orange-50 to-red-50 border-b-4 border-orange-500')
              : (isDarkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-gray-50')
          }`}
        >
          <h1 className={`font-bold text-lg transition-all duration-300 ${
            !isActive 
              ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
              : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
          }`}>
            Following
          </h1>
        </div>
      </div>

      {/* Post Input Section */}
      <div className={`flex items-start gap-4 p-6 border-b transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <div className="flex-shrink-0">
          <Avatar
            src={user?.profilePic || profile1}
            size="48"
            round
            className="ring-2 ring-orange-500/20"
          />
        </div>
        <div className="flex-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 text-lg rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 ${
              isDarkMode 
                ? 'bg-gray-900/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-orange-500/50' 
                : 'bg-gray-50/80 text-gray-900 placeholder-gray-500 border border-gray-300/50 focus:border-orange-500/50'
            }`}
            placeholder="What's on your mind? Share your thoughts..."
            rows="3"
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className={`p-6 flex items-center justify-between border-b transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'
      }`}>
        <div className="flex items-center gap-4">
          <label 
            htmlFor="file" 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
              isDarkMode ? 'hover:bg-gray-700/60 text-gray-300 hover:text-orange-400' : 'hover:bg-orange-50 text-gray-600 hover:text-orange-600'
            }`}
          >
            <CiImageOn size={24} />
            <span className="font-medium">Photo</span>
            <input
              type="file"
              id="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <button
            onClick={() => setShowPromptInput(!showPromptInput)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              showPromptInput
                ? (isDarkMode ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg')
                : (isDarkMode ? 'hover:bg-gray-700/60 text-gray-300 hover:text-purple-400' : 'hover:bg-purple-50 text-gray-600 hover:text-purple-600')
            }`}
          >
            <FaRobot size={20} />
            <span>Ask AI</span>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
          }`}
        >
          Blog It
        </button>
      </div>

      {/* AI Prompt Input */}
      {showPromptInput && (
        <div className={`p-6 border-b transition-all duration-300 ${
          isDarkMode ? 'border-gray-700/50 bg-gray-900/30' : 'border-gray-200/50 bg-purple-50/30'
        }`}>
          <div className="flex gap-4 items-center">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              type="text"
              placeholder="Ask AI to help you write something amazing..."
              className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 ${
                isDarkMode 
                  ? 'bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50' 
                  : 'bg-white/90 border border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-purple-500/50'
              }`}
            />
            <button
              onClick={handleAIResponse}
              disabled={loadingAI}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                loadingAI 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : (isDarkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg')
              }`}
            >
              {loadingAI ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate"
              )}
            </button>
                    </div>
        </div>
      )}

      {/* AI Response Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className={`max-w-2xl mx-auto mt-20 p-8 rounded-xl shadow-xl outline-none transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-800 text-white border border-gray-600"
            : "bg-white text-gray-900 border border-gray-300"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-orange-500">AI Generated Content</h2>
        <div className="max-h-96 overflow-y-auto whitespace-pre-wrap">
          {aiResponse}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={() => setShowModal(false)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              isDarkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePost;
