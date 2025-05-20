import { useState } from "react";
import useAuth from "./useAuth";
// import axios from "axios";

function ReviewForm({ onReviewSubmitted }) {
  const { token, logout } = useAuth();
  const [form, setForm] = useState({
    restaurant: "",
    rating: "",
    comments: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  }
    // setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurant", form.restaurant);
    formData.append("rating", form.rating);
    formData.append("comments", form.comments);
    formData.append("image", form.image); // file upload

    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit");
      }
      alert("Review submitted!");
      onReviewSubmitted();
    } catch (err) {
      alert("Failed to submit: ", err);
    }
    //   alert("Review submitted!");
    //   onReviewSubmitted();
    // } catch (err) {
    //   alert("Failed to submit: ", err);
    // }
  };
  return (
    <div className="bg-white shadow p-4 mb-8 max-w-md mx-auto">
      <h2 className="text-blue-600 font-bold mb-2">Add Review</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="restaurant"
          placeholder="Restaurant"
          onChange={handleChange}
          className="text-blue-600 w-full border p-2"
        />
        <input
          name="rating"
          placeholder="Rating"
          onChange={handleChange}
          className="text-blue-600 w-full border p-2"
        />
        <textarea
          name="comments"
          placeholder="Comments"
          onChange={handleChange}
          className="text-blue-600 w-full border p-2"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          placeholder="Image URL"
          onChange={handleChange}
          className="text-blue-600 w-full border p-2"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={logout}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
