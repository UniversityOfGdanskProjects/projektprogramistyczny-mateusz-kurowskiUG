interface IReview {
	id: string;
	content: string;
	createdAt: number;
	movieId: string;
	rating: number;
	userId: string;
}
export default IReview;
