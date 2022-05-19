<template>
	<div class="create-post-page">
		<h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
		<uploader :uploaded="uploadedData" action="/upload" :beforeUpload="uploadCheck" @file-uploaded="handleFileUploaed"
			class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4 ">
			<h2>点击上传头图</h2>
			<template #loading>
				<div class="d-flex ">
					<div class="spinner-border" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					<h2>正在上传...</h2>
				</div>
			</template>
			<template #success="dataProps">
				<img :src="dataProps.uploadedData.data.url">
			</template>
		</uploader>

		<validate-form @form-submit="onFormSubmit">
			<div class="mb-3">
				<label class="form-label">文章标题：</label>
				<validate-input :rules="titleRule" v-model="titleVal" placeholder="请输入文章标题" type="text" ref="inputRef" />
			</div>
			<div class="mb-3">
				<label class="form-label">文章内容：</label>
				<Editor ref="editorRef" :options="editorOptions" v-model="contentVal" @blue="checkEditor"
					:class="{ 'is-invalid': !editorstatus.isValid }"></Editor>
				<span v-if="!editorstatus.isValid" class="invalid-feedback mt-1">{{ editorstatus.message }}</span>
			</div>
			<template #submit>
				<button type="submit" class="btn btn-primary">{{ isEditMode ? '更新' : '发表' }}</button>
			</template>
		</validate-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import ValidateInput, { RulesProp } from "../components/ValidateInpute.vue"
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from "../store";
import ValidateForm from '../components/ValidateForm.vue'
import uploader from "../components/uploader.vue"
import Editor from "../components/Editor.vue";
import { beforeUploadCheck } from "../hooks/useHelper";
import useCreateMessage from "../hooks/useCreateMessage";
import { useRoute } from "vue-router";
import EasyMDE, { Options } from 'easymde';
import axios from 'axios';
interface EditorInstance {
	clear: () => void;
	getMDEInstance: () => EasyMDE | null
}
export default defineComponent({
	name: 'CreatePost',
	components: {
		ValidateInput,
		ValidateForm, uploader, Editor
	},
	setup() {
		const route = useRoute()
		const postId = route.query.id
		const isEditMode = !!postId
		const post = ref<PostProps>()
		const uploadedData = ref()
		const titleVal = ref('')
		const titleRule: RulesProp = [{ type: 'required', message: '标题不能为空' }]
		const contentVal = ref()
		const textArea = ref<null | HTMLTextAreaElement>(null)
		const editorRef = ref<EditorInstance | null>()
		const editorstatus = reactive({
			isValid: true,
			message: ""
		})
		const checkEditor = () => {
			if (contentVal.value.trim() === '') {
				editorstatus.isValid = false
				editorstatus.message = '内容不能为空'
			} else {
				editorstatus.isValid = true
				editorstatus.message = ''
			}
		}
		const editorOptions: Options = {
			spellChecker: false
		}
		let imageId = ''
		const router = useRouter()
		const store = useStore<GlobalDataProps>()
		const handleFileUploaed = (data: ResponseType<ImageProps>) => {
			if (data.data._id) {
				imageId = data.data._id
			}
		}
		onMounted(() => {

			if (postId) {
				store.dispatch('fetchPost', postId).then((res: ResponseType<PostProps>) => {
					post.value = res.data
					titleVal.value = post.value.title
					contentVal.value = post.value.excerpt
					if (post.value.image) {
						uploadedData.value = { data: post.value.image }
					}
				})
			}
		})



		const onFormSubmit = (result: boolean) => {
			checkEditor()
			if (result && editorstatus.isValid) {
				const { column, _id } = store.state.user
				if (column) {
					const newPost: PostProps = {
						title: titleVal.value,
						content: contentVal.value,
						column,
						author: _id,
					}
					if (imageId) {
						newPost.image = imageId
					}
					const actionName = isEditMode ? 'updatePost' : 'createPost'
					const sendData = isEditMode ? {
						id: postId,
						playload: newPost
					} : newPost
					store.dispatch(actionName, sendData).then(() => {
						useCreateMessage('发表成功', 'success', 2000)
						router.push({ name: 'column', params: { id: column } })
					})
					router.push({ name: 'columnDetail', params: { id: column } })
				}

			}
		}
		const uploadCheck = (file: File) => {
			const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
			const { passed, error } = result
			if (error == 'format') {
				useCreateMessage('上传图片只能是JPG/PNG', 'error')
			}
			if (error == 'size') {
				useCreateMessage('上传图片不能超过1MB', 'error')
			}
			return passed
		}
		const handleFileChange = (e: Event) => {
			const target = e.target as HTMLInputElement
			const files = target.files
			if (files) {
				const uploadedFile = files[0]
				const formData = new FormData
				formData.append(uploadedFile.name, uploadedFile)
				axios.post('/upload', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then(s => {
					console.log(s);

				})
			}
		}

		return {
			titleRule, titleVal, contentVal,
			uploadCheck, handleFileUploaed,
			onFormSubmit, isEditMode, textArea, editorOptions,
			handleFileChange, uploadedData, editorRef, checkEditor, editorstatus
		}
	}
})
</script>

<style >
.create-post-page .file-upload-container {
	height: 200px;
	cursor: pointer;
}

.create-post-page .file-upload-container img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.vue-easymde-editor.is-invalid {
	border: 1px solid #dc3545;
}
</style>