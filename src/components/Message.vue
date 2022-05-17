<script setup lang="ts">
import { PropType, ref } from "vue";
import useDomCreate from "../hooks/useDomCreate";
export type MessageType = 'success' | 'error' | 'default';
const props = defineProps({
	message: String,
	type: {
		type: String as PropType<MessageType>,
		default: 'default'
	}
})
useDomCreate('message')
const isVisible = ref(true)
const classObject = {
	'alert-success': props.type === 'success',
	'alert-danger': props.type === 'error',
	'alert-info': props.type === 'default'
}
const hide = () => {
	isVisible.value = false
}
</script>

<template>
	<teleport to="#message">
		<div v-if="isVisible" :class="classObject" class="alert fixed-top w-50 mx-auto d-flex justify-content-between mt-2 "
			style="opacity: 0.9;" role="alert">
			<span>{{ message }}</span>
			<button type="button" class="btn-close" @click.prevent="hide" aria-label="Close"></button>
		</div>
	</teleport>
</template>

<style scoped>
</style>
