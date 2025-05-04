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

const AI_API_END_POINT = "http://localhost:8080/api/ai/ask";
Modal.setAppElement("#root");

const CreatePost = () => {
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
    <div className="w-full">
      {/* Tabs */}
      <div className="mt-3 flex items-center justify-between">
        <div
          onClick={() => toggleTab("news")}
          className={`text-center w-full px-4 py-3 cursor-pointer hover:bg-gray-200 hover:rounded-lg ${
            isActive ? "border-b-4 border-orange-500" : ""
          }`}
        >
          <h1 className="font-bold text-gray-400 text-lg">News For You</h1>
        </div>
        <div
          onClick={() => toggleTab("following")}
          className={`text-center w-full px-4 py-3 cursor-pointer hover:bg-gray-200 hover:rounded-lg ${
            !isActive ? "border-b-4 border-orange-500" : ""
          }`}
        >
          <h1 className="font-bold text-gray-400 text-lg">Following</h1>
        </div>
      </div>

      {/* Post input */}
      <div className="flex items-center p-4">
        <Avatar
          src={user?.profilePic || "https://www.placecage.com/c/150/150"}
          size="40"
          round
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          className="outline-none ml-2 w-full px-2 py-1 text-lg border-none"
          placeholder="Express your thoughts and Blog it"
        />
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center gap-4">
          <label htmlFor="file" className="cursor-pointer">
            <CiImageOn size={30} />
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
            className="flex items-center gap-1 text-gray-700 hover:text-orange-600"
          >
            <FaRobot size={24} />
            <span className="text-sm font-semibold">Ask AI</span>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-blue-700 text-black font-bold px-3 py-2 rounded-full w-24"
        >
          Blog It
        </button>
      </div>

      {/* AI Prompt Input */}
      {showPromptInput && (
        <div className="p-4 flex gap-2 items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            placeholder="Ask AI to help you write..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none"
          />
          <button
            onClick={handleAIResponse}
            disabled={loadingAI}
            className={`px-4 py-2 rounded text-white ${
              loadingAI ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loadingAI ? "Loading..." : "Generate"}
          </button>
        </div>
      )}

      {/* Image Preview */}
      {image && (
        <div className="p-4">
          <img
            src={image}
            alt="Preview"
            className="w-32 rounded-lg max-h-60 object-cover"
          />
          <button
            onClick={() => setImage(null)}
            className="mt-2 text-white px-3 py-2 rounded-full bg-black hover:bg-red-700"
          >
            Remove Image
          </button>
        </div>
      )}

      {/* AI Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white rounded-xl max-w-lg mx-auto mt-20 p-6 shadow-xl outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start"
      >
        <h2 className="text-lg font-bold mb-3">AI Generated Text</h2>
        <textarea
          readOnly
          value={aiResponse}
          className="w-full h-40 border border-gray-300 rounded p-2 resize-none"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(aiResponse);
            toast.success("Copied to clipboard!");
          }}
          className="bg-green-600 text-white px-4 py-2 mt-3 rounded hover:bg-green-700"
        >
          Copy Text
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-500 text-white px-4 py-2 mt-2 rounded hover:bg-gray-600 ml-2"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default CreatePost;
