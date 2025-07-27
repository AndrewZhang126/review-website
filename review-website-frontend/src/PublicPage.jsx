import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import { fetchReviewsAPI } from "./utils/api";

function PublicPage() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    fetchReviewsAPI()
      .then(setReviews)
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return <ReviewList reviews={reviews} />;
}

export default PublicPage;
