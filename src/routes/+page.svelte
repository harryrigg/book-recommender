<script lang="ts">
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import RecommendationsList from '$lib/components/RecommendationsList.svelte';
	import type { BookRecommendations } from '$lib/types';
	import { ArrowRightIcon, LoaderCircleIcon, RotateCcwIcon } from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';

	let currentBookName = $state('');
	let books = $state<string[]>([]);

	let recommendedBooks = $state<BookRecommendations | null>(null);

	let isLoading = $state(false);

	function addBook() {
		if (books.length === 10) {
			toast.error('You can not add more than 10 books');
			return;
		}
		if (currentBookName.trim() === '') return;
		books = [...books, currentBookName];
		currentBookName = '';
	}

	function removeBook(index: number) {
		books = books.filter((_, i) => i !== index);
	}

	function reset() {
		currentBookName = '';
		books = [];
		recommendedBooks = null;
	}

	async function getRecommendations() {
		if (books.length === 0) {
			toast.error('Please add at least one book');
			return;
		}

		const inputBooks = books.map((book) => ({ title: book }));

		isLoading = true;
		const response = await fetch('/api/recommendations', {
			method: 'POST',
			body: JSON.stringify(inputBooks),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		isLoading = false;

		if (!response.ok) {
			if (response.status === 429) {
				toast.error('Too many requests. Please try again later');
			} else {
				toast.error('Something went wrong. Please try again later');
			}
			return;
		}

		const data: BookRecommendations = await response.json();

		if (data.books.length === 0) {
			toast.error('No recommendations found');
		} else {
			recommendedBooks = data;
		}
	}
</script>

<div class="flex h-full flex-col items-center justify-center bg-zinc-100 md:gap-8">
	<h1 class="py-8 text-center text-4xl md:py-0">AI Book Recommender</h1>
	<div
		class="flex min-h-0 w-full max-w-[700px] flex-1 flex-col gap-2 rounded-lg px-6 py-4 md:h-[500px] md:flex-initial md:p-4 md:shadow-[0px_0px_5px_rgb(0_0_0_/_0.1)]"
	>
		{#if recommendedBooks === null}
			{#if books.length === 0}
				<div class="flex flex-1 items-center justify-center text-center text-gray-500">
					To get recommendations, enter books that you have read and enjoyed
				</div>
			{:else}
				<ul class="min-h-0 flex-1 space-y-2 overflow-y-auto">
					{#each books as book, i}
						<li class="flex justify-between rounded bg-gray-200 px-3 py-2.5">
							{book}
							<button onclick={() => removeBook(i)} class="text-red-800"> Remove </button>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={currentBookName}
					placeholder="Book name"
					class="flex-1 rounded px-3 py-2.5"
					onkeydown={(e) => e.key === 'Enter' && addBook()}
				/>

				<button onclick={addBook} class="rounded border border-gray-400 bg-gray-200 px-4">
					Add Book
				</button>
			</div>
			<PrimaryButton onclick={getRecommendations} disabled={isLoading}>
				{#if isLoading}
					<LoaderCircleIcon class="size-5 animate-spin" />
				{:else}
					Get Recommendations <ArrowRightIcon class="size-5" />
				{/if}
			</PrimaryButton>
		{:else}
			<h2>Your Recommended Books</h2>
			<RecommendationsList books={recommendedBooks.books} />

			<PrimaryButton onclick={reset}>
				Reset <RotateCcwIcon class="size-5" />
			</PrimaryButton>
		{/if}
	</div>
</div>

<Toaster position="top-center" class="block md:hidden" />
<Toaster position="bottom-center" class="hidden md:block" />
