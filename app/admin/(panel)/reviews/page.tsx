import ReviewsManager from "@/components/admin/ReviewsManager";
import { listAllReviews } from "@/lib/products";

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews();

  return <ReviewsManager initialReviews={reviews} />;
}
