<script setup lang="ts">
import { useStore } from 'vuex'
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, ref } from 'vue';
import { marked } from 'marked';
import { computed } from '@vue/reactivity';
import { PostProps, ResponseType } from "../store";
import Modal from "./Modal.vue"
import useCreateMessage from "../hooks/useCreateMessage";
const store = useStore()
const route = useRoute()
const router = useRouter()
const currentId = route.params.id
const modelIsVisible = ref(false)
const post = ref<PostProps>()
const currentHTML = computed(() => {
	if (post.value && post.value.excerpt) {
		return marked.parse(post.value.excerpt)
	}
})
onBeforeMount(() => {
	store.dispatch('fetchPost', currentId).then(res => {
		post.value = res.data
	})
})

const showEditArea = computed(() => {
	const { _id } = store.state.user
	if (post.value && post.value.author) {
		return post.value.author._id === _id
	} else {
		return false
	}
})
const hideAndDelete = () => {
	modelIsVisible.value = false
	store.dispatch('deletePost', currentId).then((res: ResponseType<PostProps>) => {
		useCreateMessage(`${currentId}文章,删除成功`, 'success')
		router.push({ name: 'columnDetail', params: { id: res.data.column } })
	})
}
</script>
 
<template>
	<div>
		<Modal title="删除文章" :visible="modelIsVisible" @modal-on-close="modelIsVisible = false"
			@modal-on-confirm="hideAndDelete">
			<p>你确定要删除吗？？？？?</p>
		</Modal>
		<img :src="post?.image.url" class="img-fluid" alt="...">
		<h1>{{ post?.title }}</h1>
		<h2 v-html="post?.excerpt"></h2>
	</div>
	<div v-if="showEditArea" class="btn-group mt-5">
		<router-link type="button" class="btn btn-primary" :to="{ name: 'createPost', query: { id: post._id } }">编辑
		</router-link>
		<button type="button" class="btn btn-danger" @click="modelIsVisible = true">删除</button>

	</div>
</template>

<style>
img {
	height: 200px;
	width: 400px;
	object-fit: cover;
}
</style>
