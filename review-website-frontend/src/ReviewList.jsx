import ReviewCard from "./ReviewCard";

function ReviewList({ reviews }) {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-blue-600 text-3xl font-bold text-center mb-8">
        My Restaurant Reviews
      </h1>

      {reviews.length > 0 ? (
        reviews.map((review) => <ReviewCard key={review.ID} review={review} />)
      ) : (
        <p className="text-center text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}

export default ReviewList;
