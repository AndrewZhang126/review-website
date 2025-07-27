import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import useAuth from "./useAuth";
import { fetchReviewsAPI, deleteReviewAPI } from "./utils/api";

function AdminPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviewsAPI()
      .then(setReviews)
      .catch((err) => alert(err.message));
  }, []);

  const handleDeleteReview = async (id) => {
    try {
      await deleteReviewAPI(id, token);
      setReviews((prev) => prev.filter((r) => r.ID !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    navigate("/"); // redirect to public-facing page
    logout();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-blue-600 text-3xl font-bold text-center mb-8">
        Admin Dashboard
      </h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <ReviewForm
        onReviewSubmitted={() => fetchReviewsAPI().then(setReviews)}
      />
      {reviews.map((review) => (
        <ReviewCard
          key={review.ID}
          review={review}
          onDelete={handleDeleteReview}
        />
      ))}
    </div>
  );
}

export default AdminPage;
