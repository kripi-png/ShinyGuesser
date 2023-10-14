<script lang="ts">
	import svelteLogo from './assets/svelte.svg';
	import viteLogo from '/vite.svg';
	import Counter from './lib/Counter.svelte';

	import { onMount } from 'svelte';

	const getNumber = async () => {
		const res = await fetch('http://localhost:8000/random');
		const { random } = await res.json();
		return random;
	};
</script>

<div>
	{#await getNumber()}
		Loading...
	{:then number}
		{number}
	{/await}
</div>
