<template>
	<div class="home-page">
		<section class="py-5 text-center container">
			<div class="row py-lg-5">

				<div class="col-lg-6 col-md-8 mx-auto">
					<img src="../assets/callout.svg" alt="callout" class="w-50" />
					<div>

					</div>
					<h2 class="font-weight-light">随心写作，自由表达</h2>
					{{ biggerc }}
					<p>
						<router-link to="/createPost" class="btn btn-primary my-2">开始写文章</router-link>
					</p>
				</div>
			</div>
		</section>
		<h4 class="font-weight-bold text-center">发现精彩</h4>
		<Column :list="list"></Column>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore } from "vuex";
import { GlobalDataProps, ResponseType, ImageProps } from "../store"
import Column from '../components/Column.vue'
import uploader from "../components/uploader.vue";
import useCreateMessage from "../hooks/useCreateMessage"
export default defineComponent({
	name: 'Home',
	components: {
		Column, uploader
	},
	setup() {
		onMounted(() => {
			store.dispatch('fetchColumns')
		})
		const store = useStore<GlobalDataProps>()
		const list = computed(() => store.getters.getColumns)

		const beforeUploader = (file: File) => {
			const isJPG = file.type === 'image/jpeg'
			if (!isJPG) {
				useCreateMessage('上传图片只能是JPG格式', 'error')
			}
			return isJPG
		}
		const onFileUploaded = (data: ResponseType<ImageProps>) => {
			useCreateMessage(`上传图片ID${data.data._id}`, 'success')
		}
		const uploadRef = ref()
		const clearImage = () => {
			if (uploadRef.value) {
				uploadRef.value.clearUpload()
			}
		}
		return {
			list, beforeUploader, onFileUploaded, clearImage, uploadRef
		}
	}
})
</script>