import useAuth from "./useAuth";

/***
 * Shows a specific review
 */
function ReviewCard({ review, onDelete }) {
  const { token } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-md mx-auto mb-6">
      {token && <button onClick={() => onDelete(review.ID)}>Delete</button>}
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
