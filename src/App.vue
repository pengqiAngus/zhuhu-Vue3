<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { computed, onMounted, watch } from 'vue';
import { useStore } from "vuex";
import { GlobalDataProps } from "./store";
import GlobalHeader from './components/GlobalHeader.vue';
import Loader from "./components/Loader.vue";
import useCreateMessage from "./hooks/useCreateMessage";
import axios from 'axios';
const store = useStore<GlobalDataProps>()
const isLoading = computed(() => store.state.loading)
const currentUser = computed(() => store.state.user)
const token = computed(() => store.state.token)
const error = computed(() => store.state.error)
onMounted(() => {
	if (!currentUser.value.isLogin && token.value) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
		store.dispatch('fetchCurrentUser')
	}
})
watch(() => error.value.status, () => {
	const { status, message } = error.value
	if (status && message) {
		useCreateMessage(message as string, 'error', 2000)
	}
})


</script>

<template>
	<div class="container">
		<GlobalHeader :user="currentUser" />
		<Loader v-if="isLoading" text="正在加载!!!!" />
		<router-view></router-view>
		<footer class="text-center py-4 text-secondary bg-light mt-6">
			<small>
				<ul class="list-inline mb-0">
					<li class="list-inline-item">© 2020 者也专栏</li>
					<li class="list-inline-item">课程</li>
					<li class="list-inline-item">文档</li>
					<li class="list-inline-item">联系</li>
					<li class="list-inline-item">更多</li>
				</ul>
			</small>
		</footer>
	</div>
</template>

<style>
</style>
