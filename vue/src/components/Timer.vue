<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTimerStore } from '@/stores/timer';
const store = useTimerStore();
const { formattedTime } = storeToRefs(store);
</script>

<template>
	<h2 class="mt-8">Time {{ formattedTime }}</h2>
</template>
