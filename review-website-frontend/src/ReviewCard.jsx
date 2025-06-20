import React from "react";
import useAuth from "./useAuth";


function ReviewCard({ review, onDelete }) {

   const { token } = useAuth();

   const handleDelete = async () => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

    try {
      const res = await fetch(`${API_BASE}/api/reviews/${review.ID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      onDelete(review.ID);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-md mx-auto mb-6">
    {token && (
        <button onClick={handleDelete}>Delete</button>
      )}
      {review.photo ? (
        <img
          src={review.photo}
          alt={review.restaurant}
          className="rounded-xl mb-4 w-full h-48 object-cover"
        />
      ) : null}
      <h2 className="text-blue-600 text-xl font-bold">{review.restaurant}</h2>
      <p className="text-yellow-500 font-semibold">⭐ {review.rating}</p>
      <p className="text-blue-600 mt-2">{review.comments}</p>
    </div>
  );
}

export default ReviewCard;