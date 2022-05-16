<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { computed } from 'vue';
import { useStore } from "vuex";
import GlobalHeader from './components/GlobalHeader.vue';
import Loader from "./components/Loader.vue";
const store = useStore()
const isLoading = computed(() => store.state.loading)
const currentUser = computed(() => store.state.user)




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
