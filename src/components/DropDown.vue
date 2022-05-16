<script setup lang="ts">
import { computed, defineProps, onMounted, onUnmounted, PropType, ref, watch } from "vue";
import useClickOutside from "../hooks/useClickOutside"
const props = defineProps({
	title: {
		type: String,
		required: true
	}
})
const isOpen = ref(false)
const toggle = () => {
	isOpen.value = !isOpen.value
}
const dropdownRef = ref<null | HTMLElement>(null)
const isClickOutside = useClickOutside(dropdownRef)
watch(isClickOutside, () => {
	if (isOpen.value && isClickOutside.value) {
		isOpen.value = false
	}
})

</script>

<template>
	<div class="dropdown" ref="dropdownRef">
		<a href="" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggle">{{ title }}</a>
		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" :style="{ display: 'block' }" v-if="isOpen">
			<slot></slot>
		</ul>
	</div>
</template>

<style>
</style>
