import React, { useState } from "react";
import Avatar from "react-avatar";
import { HiPhoto, HiSparkles, HiXMark } from "react-icons/hi2";
import axios from "axios";
import { BLOG_API_END_POINT } from "../utils/constant";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleRefresh, getisActive, addNewBlog } from "../redux/blogsSlics";
import profile1 from "../assets/profile.png";

const AI_API_END_POINT = "http://localhost:8080/api/ai/ask";

if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [aiResponse, setAIResponse] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.blogs);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!description.trim() && !image) {
      return toast.error("Please enter text or attach an image.");
    }

    try {
      setLoadingPost(true);
      const payload = {
        description: description.trim(),
        id: user._id,
        image: image || "",
      };

      const res = await axios.post(`${BLOG_API_END_POINT}/create`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data.blog) {
          dispatch(addNewBlog(res.data.blog));
        }
        dispatch(toggleRefresh());
        toast.success(res.data.message || "Post created successfully");
        setDescription("");
        setImage(null);
      } else {
        toast.error(res.data.message || "Failed to publish post.");
      }
    } catch (error) {
      console.error("Post Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size must be under 5MB.");
      }
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAIResponse = async () => {
    if (!prompt.trim()) {
      return toast.error("Please enter an AI prompt topic.");
    }

    try {
      setLoadingAI(true);
      const res = await axios.post(
        AI_API_END_POINT,
        { question: prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.result) {
        setDescription(res.data.result);
        setAIResponse(res.data.result);
        setShowModal(true);
        toast.success("AI draft generated!");
        setPrompt("");
        setShowPromptInput(false);
      } else {
        toast.error("AI service did not return content.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error(error.response?.data?.message || "Failed to generate AI content.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      {/* Editorial Feed Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => dispatch(getisActive(true))}
          className={`flex-1 py-3 px-4 font-bold text-xs tracking-wide transition-all ${
            isActive
              ? "text-slate-900 border-b-2 border-slate-900 bg-slate-50/50"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          All News Feed
        </button>
        <button
          onClick={() => dispatch(getisActive(false))}
          className={`flex-1 py-3 px-4 font-bold text-xs tracking-wide transition-all ${
            !isActive
              ? "text-slate-900 border-b-2 border-slate-900 bg-slate-50/50"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          Following
        </button>
      </div>

      {/* Input Body */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex gap-3 items-start">
          <Avatar
            src={user?.profilePic || profile1}
            size="40"
            round
            className="border border-slate-200 flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-sm rounded-xl outline-none resize-none bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 transition-colors"
              placeholder="What's breaking? Share news or your thoughts..."
              rows={3}
            />

            {/* Image Preview */}
            {image && (
              <div className="relative inline-block mt-1">
                <img
                  src={image}
                  alt="Upload Preview"
                  className="w-28 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-900 text-white shadow hover:bg-rose-600 transition-colors"
                  title="Remove Image"
                >
                  <HiXMark size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Prompt Input Bar */}
        {showPromptInput && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <HiSparkles size={16} className="text-amber-500" />
              <span>AI Writing Assistant</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI to write a post about..."
                className="flex-1 px-3 py-2 text-xs rounded-lg outline-none bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400"
                onKeyDown={(e) => e.key === "Enter" && handleAIResponse()}
              />
              <button
                onClick={handleAIResponse}
                disabled={loadingAI}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50"
              >
                {loadingAI ? "Drafting..." : "Generate"}
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="blog-photo-upload"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <HiPhoto size={18} className="text-slate-500" />
              <span>Photo</span>
              <input
                type="file"
                id="blog-photo-upload"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <button
              onClick={() => setShowPromptInput(!showPromptInput)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                showPromptInput
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <HiSparkles size={16} className={showPromptInput ? "text-amber-300" : "text-amber-500"} />
              <span>Ask AI</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loadingPost}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {loadingPost ? "Posting..." : "Publish Post"}
          </button>
        </div>
      </div>

      {/* AI Preview Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="max-w-lg w-full mx-4 sm:mx-auto mt-20 p-6 rounded-2xl bg-white border border-slate-200 shadow-xl outline-none"
        overlayClassName="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-start z-50 p-4"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-slate-900">
            <HiSparkles size={18} className="text-amber-500" />
            <h3 className="text-base font-bold">AI Draft Generated</h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800"
          >
            <HiXMark size={20} />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-4 rounded-xl bg-slate-50 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap border border-slate-200">
          {aiResponse}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
          >
            Use Draft
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePost;