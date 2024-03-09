<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { formatSeconds } from '../utils';

type LeaderboardEntry = {
	user: string;
	streak: number;
	time: number;
};
let leaderboardData = ref<LeaderboardEntry[]>([]);
onMounted(async () => {
	// get top 10
	const res = await fetch('/api/leaderboard');
	const { data } = await res.json();
	leaderboardData.value = data;
});
</script>

<template>
	<div class="leaderboard">
		<h1>Leaderboard (top 10)</h1>
		<span class="note"
			>After submitting a score, reload the page to see the changes.</span
		>
		<span class="note"
			>Only the highest score of a user is saved, or in case of tie, the better
			time.</span
		>
		<v-table>
			<thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
					<th>Streak</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(entry, index) in leaderboardData" :key="entry.user">
					<td>{{ index + 1 }}</td>
					<td>{{ entry.user }}</td>
					<td>{{ entry.streak }}</td>
					<td>{{ formatSeconds(entry.time) }}</td>
				</tr>
			</tbody>
		</v-table>
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
