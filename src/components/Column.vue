<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";
import { ColumnProps } from "../store";
const props = defineProps({
	list: {
		type: Array as PropType<ColumnProps[]>,
		required: true,
	},
});
const columnList = computed(() => {
	return props.list.map(s => {
		if (!s.avatar) {
			s.avatar = {
				url: 'https://ys.mihoyo.com/main/_nuxt/img/37207c1.jpg',
			}
		}
		return s
	})
})
</script>

<template>
	<div class="row">
		<div class="col-4 mb-3" v-for="column in columnList" :key="column.id">
			<div class="card h-100 shaow-sm">
				<div class="card-body text-center">
					<img class="rounded mx-auto d-block  border border-light w-50 my-3" :src="column.avatar?.url"
						:alt="column.title">
					<h5 class="card-title">{{ column.description }}</h5>
					<p class="card-text text-left">{{ column.description }}</p>
					<router-link class="btn btn-outline-primary" :to="{ name: 'columnDetail', params: { id: column._id } }">进入专栏
					</router-link>
				</div>

			</div>

		</div>
	</div>
</template>

<style scoped>
</style>
