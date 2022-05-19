<script setup lang="ts">
import axios from "axios";
import { ref, defineProps, PropType, watch } from "vue";
type uploadStatus = 'ready' | 'loading' | 'success' | 'error'
type checkFunction = (file: File) => boolean
const props = defineProps({
	action: {
		type: String,
		required: true
	},
	beforeUpload: {
		type: Function as PropType<checkFunction>
	},
	uploaded: {
		type: Object
	}
})
inheritAttrs: false
const emit = defineEmits(
	['fileUploaded', 'fileUploadedError']
)
const fileStatus = ref<uploadStatus>(props.uploaded ? 'success' : 'ready')
const fileInput = ref<null | HTMLInputElement>(null)
const uploadedData = ref(props.uploaded)
watch(() => props.uploaded, (newValue) => {
	if (newValue) {
		fileStatus.value = 'success'
		uploadedData.value = newValue
	}
})
const triggerUpload = () => {

	if (fileInput.value) {
		fileInput.value.click()
	}
}
const handleFileChange = (e: Event) => {
	const target = e.target as HTMLInputElement

	if (target.files) {
		const files = target.files

		if (props.beforeUpload) {
			const result = props.beforeUpload(files[0])
			if (!result) {
				return
			}
		}
		fileStatus.value = 'loading'
		const formData = new FormData()
		formData.append(files[0].name, files[0])
		axios.post(props.action, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(s => {
			fileStatus.value = 'success'
			uploadedData.value = s.data
			emit('fileUploaded', uploadedData.value)
		}).catch(e => {
			fileStatus.value = 'error'
			emit('fileUploadedError', { e })
		}).finally(() => {
			if (fileInput.value) {
				fileInput.value.value = ''
			}
		})
	}
}
const clearUpload = () => {
	uploadedData.value = {}
	fileStatus.value = 'ready'
}
defineExpose({ clearUpload })
</script>

<template>
	<div class="file-upload">
		<div class="file-upload-container" @click="triggerUpload" v-bind="$attrs">
			<slot v-if="fileStatus === 'loading'" name="loading">
				<button class="btn btn-primary" disabled>正在上传...</button>
			</slot>
			<slot v-else-if="fileStatus === 'error'" name="error">
				<button class="btn btn-primary" disabled>上传失败...</button>
			</slot>
			<slot v-else-if="fileStatus === 'success'" name="success" :uploadedData="uploadedData">
				<button class="btn btn-primary" disabled>上传成功</button>
			</slot>
			<slot v-else>
				<button class="btn btn-primary">点击上传</button>
			</slot>
		</div>
		<input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
	</div>
</template>

<style scoped>
</style>
