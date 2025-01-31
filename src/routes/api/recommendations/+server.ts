import { openai } from '$lib/server/openai';
import { bookRecommendationsSchema, type InputBook } from '$lib/types';
import type { RequestHandler } from './$types';
import { zodResponseFormat } from 'openai/helpers/zod';
import { error, json } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

const limiter = new RateLimiter({
	IPUA: [
		[5, 'm'],
		[20, 'h'],
		[50, 'd']
	]
});

export const POST: RequestHandler = async (req) => {
	if (await limiter.isLimited(req)) throw error(429);

	const books: InputBook[] = await req.request.json();

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini-2024-07-18',
		messages: [
			{
				role: 'developer',
				content: `
                    You are a helpful assistant that can recommend books to a
                    user based on a list of books they have previously read and enjoyed.
                    If you are provided with a book that does not exist, then do
                    not use that book to make a recommendation. Only make recommendations
                    when you are given valid books as input to use for the recommendation.
                    When provided with 1 book, recommend 3 books. When provided with 2 books,
                    recommend 4 books. When provided with 3 or more books, recommend 5 books.
					You must only recommend books which are real and exist.
                `
			},
			{
				role: 'user',
				content: `I have read and enjoyed the following books: [${books.map((book) => `"${book.title}"`).join(', ')}].`
			}
		],
		response_format: zodResponseFormat(bookRecommendationsSchema, 'recommendations')
	});

	const message = completion.choices[0].message;

	if (message.content === null) {
		return json({ error: 'No recommendations found' }, { status: 404 });
	}

	return json(JSON.parse(message.content), { status: 200 });
};
