<script lang="ts">
	let {
		children,
		onclick,
		disabled = false
	}: {
		children: any;
		onclick: () => void;
		disabled?: boolean;
	} = $props();
</script>

<button
	{onclick}
	{disabled}
	class="flex h-12 items-center justify-center gap-2.5 rounded border bg-blue-400 font-semibold tracking-wide hover:bg-blue-400/90 disabled:bg-blue-400/70"
>
	{@render children()}
</button>
