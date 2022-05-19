<script setup lang="ts">
import { useStore } from 'vuex'
import { useRoute } from "vue-router";
import { onBeforeMount, onMounted, ref } from 'vue';
import { ImageProps } from "../store";
const store = useStore()
const route = useRoute()
const currentId = route.params.id
interface IPost {
	image: ImageProps,
	title: string
	excerpt: string
}
const post = ref<IPost>()
onBeforeMount(() => {
	store.dispatch('fetchPost', currentId).then(res => {
		post.value = res.data
	})
})


</script>
 
<template>
	<div>
		<img :src="post?.image.url" class="img-fluid" alt="...">
		<h1>{{ post?.title }}</h1>
		<h2>{{ post?.excerpt }}</h2>
	</div>
</template>

<style>
img {
	height: 200px;
	width: 400px;
	object-fit: cover;
}
</style>
