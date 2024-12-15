import mongoose from "mongoose";

const removeUnusedIndexes = async () => {
  try {
    const User = mongoose.model("User");
    await User.collection.dropIndex("phone_1"); // Specify the index name
    console.log("Removed unique index on phone field from User collection.");
  } catch (error) {
    console.error("Error removing index:", error.message);
  }
};

export default removeUnusedIndexes;
