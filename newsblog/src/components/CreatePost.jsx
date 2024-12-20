import React, { useState } from "react";
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { BLOG_API_END_POINT } from "../utils/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleRefresh, getisActive } from "../redux/blogsSlics";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const { user, profile } = useSelector((store) => store.user);
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

      const res = await axios.post(`${BLOG_API_END_POINT}/create`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(toggleRefresh());
        toast.success(res.data.message);
        setDescription("");
        setImage(null); // Reset image
      } else {
        toast.error(res.data.message || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Convert file to Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const foryou = () => {
    dispatch(getisActive(true));
  };

  const followinghandler = () => {
    dispatch(getisActive(false));
  };

  return (
    <div className="w-[100%]">
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div
            onClick={foryou}
            className={`text-center hover:bg-gray-200 w-full px-4 py-3 cursor-pointer hover:rounded-lg ${
              isActive ? "border-b-4 border-orange-500" : ""
            }`}
          >
            <h1 className="font-bold text-gray-400 text-lg">News For You</h1>
          </div>

          <div
            onClick={followinghandler}
            className={`text-center hover:bg-gray-200 w-full px-4 py-3 cursor-pointer hover:rounded-lg ${
              !isActive ? "border-b-4 border-orange-500" : ""
            }`}
          >
            <h1 className="font-bold text-gray-400 text-lg">Following</h1>
          </div>
        </div>
        <div>
          <div className="flex items-center p-4">
            <Avatar
              src={profile?.profilePic || "https://via.placeholder.com/150"}
              size="40"
              round={true}
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              className="outline-none ml-2 w-full border-none px-2 py-1 text-lg"
              placeholder="Express your thoughts and Blog it"
            />
          </div>
          <div className="p-4 flex text-center justify-between border-b border-gray-300">
            <div>
              <label htmlFor="file">
                <CiImageOn size={30} />
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  accept="image/jpg, image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-blue-700 text-black font-bold px-3 py-2 rounded-full w-24"
            >
              Blog It
            </button>
          </div>
          {/* Display the image preview */}
          {image && (
            <div className="p-4">
              <img
                src={image}
                alt="Preview"
                className="w-32 rounded-lg max-h-60 object-cover "
              />
              <button
                onClick={() => setImage(null)}
                className="mt-2 text-white px-3 py-2 rounded-full bg-black hover:bg-red-800 "
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
