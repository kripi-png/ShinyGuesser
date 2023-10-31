<script setup lang="ts">
import { ref, onMounted } from 'vue';

let leaderboardData = ref([]);
onMounted(async () => {
	// get top 10
	const res = await fetch('/api/leaderboard/10');
	leaderboardData.value = await res.json();
});
</script>

<template>
	<div class="leaderboard">
		<h1>Leaderboard (top 10)</h1>
		<span class="note"
			>Scores may be reset at any time as the feature is still in
			development</span
		>
		<span class="note"
			>After submitting a score, reload the page to see the changes.</span
		>
		<span class="note">Only the highest score of a user is saved.</span>
		<ul v-if="leaderboardData.length" class="leaderboardList">
			<li
				v-for="([name, score], index) in leaderboardData"
				:key="name"
				class="leaderboardItem"
			>
				{{ index + 1 }}. {{ name }} - {{ score }}
			</li>
		</ul>
		<h2 v-else>Empty</h2>
	</div>
</template>

<style scoped>
.note {
	color: blue;
}
.leaderboard {
	margin-top: auto;
	padding: 1em;
	text-align: center;
}
.leaderboardList {
	list-style: none;
}

.leaderboardItem {
	font-size: 1.5em;
}
</style>
