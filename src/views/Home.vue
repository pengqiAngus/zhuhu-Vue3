<template>
	<div class="home-page">
		<section class="py-5 text-center container">
			<div class="row py-lg-5">

				<div class="col-lg-6 col-md-8 mx-auto">
					<img src="../assets/callout.svg" alt="callout" class="w-50" />
					<div>

					</div>
					<h2 class="font-weight-light">随心写作，自由表达</h2>
					<p>
						<router-link to="/createPost" class="btn btn-primary my-2">开始写文章</router-link>
					</p>
				</div>
			</div>
		</section>
		<h4 class="font-weight-bold text-center">发现精彩</h4>
		<Column :list="list"></Column>
		<div class="footer">
			<button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePgae"
				v-if="!isLastPage">加载更多</button>
			<h4 style="color:#636e72" v-else>已经没有了!!!!</h4>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore } from "vuex";
import { GlobalDataProps, ResponseType, ImageProps } from "../store"
import Column from '../components/Column.vue'
import uploader from "../components/uploader.vue";
import useCreateMessage from "../hooks/useCreateMessage"
import useLoadMore from "../hooks/useLoadMore"
export default defineComponent({
	name: 'Home',
	components: {
		Column, uploader
	},
	setup() {
		const store = useStore<GlobalDataProps>()
		const total = computed(() => store.state.columns.total)
		const currentPage = computed(() => store.state.columns.currentPage)
		onMounted(() => {
			store.dispatch('fetchColumns', { pageSize: 3 })
		})
		const list = computed(() => store.getters.getColumns)
		const { loadMorePgae, isLastPage } = useLoadMore('fetchColumns', total, { currentPage: (currentPage.value ? currentPage.value + 1 : 2), pageSize: 3, })
		return {
			list, loadMorePgae, isLastPage
		}
	}
})
</script>
<style scoped>
.footer {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>