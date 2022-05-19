<script setup lang="ts">
import { defineProps, PropType } from 'vue'
import { PostProps } from "../store";
const props = defineProps({
	list: {
		type: Array as PropType<PostProps[]>,
		required: true
	}
})

</script>

<template>
	<div class="post-list">
		<article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
			<div class="card-body">
				<router-link class="link" :to="{ name: 'postDetail', params: { id: post._id } }">
					<h2>{{ post.title }}</h2>
				</router-link>
				<div class="row my-3 align-items-center">
					<div v-if="post.image" class="col-3">
						<img :src="post.image?.url" :alt="post.title" class="rounded-lg w-100">
					</div>
					<p :class="{ 'col-9': post.image }">{{ post.excerpt }}</p>
				</div>
				<span class="text-muted">{{ post.createdAt }}</span>
			</div>
		</article>
	</div>
</template>

<style>
.link {
	text-decoration: none;
	color: black;
	font-weight: bold;
}
</style>
