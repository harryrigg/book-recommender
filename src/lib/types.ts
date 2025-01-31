import { z } from 'zod';

export type InputBook = {
	title: string;
};

export const bookRecommendationSchema = z.object({
	title: z.string(),
	author: z.string(),
	genre: z.string(),
	reasonForRecommendation: z.string()
});

export const bookRecommendationsSchema = z.object({
	books: z.array(bookRecommendationSchema)
});

export type BookRecommendation = z.infer<typeof bookRecommendationSchema>;
export type BookRecommendations = z.infer<typeof bookRecommendationsSchema>;
