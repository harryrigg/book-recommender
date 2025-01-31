<script lang="ts">
	import type { BookRecommendation } from '$lib/types';
	import { ChevronDownIcon } from 'lucide-svelte';
	import { Accordion } from 'bits-ui';
	import { slide } from 'svelte/transition';

	let {
		books
	}: {
		books: BookRecommendation[];
	} = $props();
</script>

<Accordion.Root class="flex-1 space-y-2">
	{#each books as book}
		<Accordion.Item value={book.title} class="rounded bg-gray-200 px-2 py-1.5">
			<Accordion.Header class="flex items-center gap-2">
				<Accordion.Trigger class="[&[data-state=open]>svg]:rotate-180">
					<ChevronDownIcon class="transition-transform duration-200" />
				</Accordion.Trigger>
				<div class="flex flex-col md:flex-row md:gap-1">
					<span class="font-semibold">{book.title}</span>
					<span class="hidden md:inline">&#8226;</span>
					<span class="text-sm md:text-base">{book.author}</span>
				</div>
				<span class="ml-auto mr-1.5 text-right text-sm italic text-gray-500">{book.genre}</span>
			</Accordion.Header>
			<Accordion.Content
				class="mt-1 px-1 pb-1"
				transition={slide}
				transitionConfig={{ duration: 200 }}
			>
				{book.reasonForRecommendation}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
