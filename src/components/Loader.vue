<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue';

const props = defineProps({
	text: String,
	background: String
})
const node = document.createElement('div')

onBeforeMount(() => {
	node.id = 'back'
	document.body.appendChild(node)
})
onUnmounted(() => {
	document.body.removeChild(node)
})
</script>

<template>
	<teleport to="#back">
		<div class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
			:style="{ backgroundColor: background || '' }">
			<div class="loading-content">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p v-if="text" class="text-primary small">{{ text }}</p>
			</div>
		</div>
	</teleport>
</template>

<style scoped>
.loading-container {
	background: rgba(255, 255, 255, .5);
	z-index: 100;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
}

.loading-container {
	text-align: center;
}
</style>
