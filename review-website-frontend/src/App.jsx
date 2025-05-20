import { useEffect, useState } from 'react'
// import axios from 'axios';
import './App.css';
import './index.css';

import useAuth from "./useAuth";
import LoginForm from "./LoginForm";
import ReviewForm from "./ReviewForm";

// const sampleReview = {
//   restaurant: "Joe’s Pizza",
//   rating: 4.5,
//   review: "Delicious New York-style pizza with crispy thin crust and gooey cheese.",
//   photoUrl: "review-website-frontend/src/assets/react.svg"
// };
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-md mx-auto mb-6">
      <img src={review.photo} alt={review.restaurant} className="rounded-xl mb-4 w-full h-48 object-cover" />
      <h2 className="text-blue-600 text-xl font-bold">{review.restaurant}</h2>
      <p className="text-yellow-500 font-semibold">⭐ {review.rating}</p>
      <p className="text-blue-600 mt-2">{review.comments}</p>
    </div>
  );
}

/**
 * @typedef {Object} Review
 * @property {number} ID
 * @property {string} restaurant // name of restaurant
 * @property {string} rating // rating out of 5
 * @property {string} review // summary of review
 * @property {string} photo // url for photo
 */
function App() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async() => {
    // axios.get('http://localhost:8080/api/reviews')
    // .then((res) => setReviews(res.data))
    // .catch((err) => console.error('Error fetching reviews: ', err));
    try {
      const res = await fetch('http://localhost:8080/api/reviews')
      if (!res.ok) {
        throw new Error("Failed to load reviews")
      }
      const data = await res.json()
      setReviews(data)
    }
    catch (err) {
      alert("Error leading reviews: ", err)
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen p-6">
    <h1 className="text-blue-600 text-3xl font-bold text-center mb-8">My Restaurant Reviews</h1>

    {!token ? <LoginForm /> : <ReviewForm onReviewSubmitted={fetchReviews}/>}

    {reviews.length > 0 ? (
      reviews.map((review) => (
        <ReviewCard key={review.ID} review={review} />
      ))
    ) : (
      <p className="text-center text-gray-500">No reviews yet.</p>
    )} 
    </div>
  )
}

export default App
