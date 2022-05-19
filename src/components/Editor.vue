<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted, watch } from "vue";
import EasyMDE, { Options } from "easymde";
interface EditorProps {
	modelValue?: string;
	options?: Options
}
interface EditorEvent {
	(type: 'update:modelValue', value: string): void
	(type: 'change', value: string): void,
	(type: 'blue'): void
}
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvent>()
const textArea = ref<null | HTMLTextAreaElement>(null)
let easyModeInstance: EasyMDE | null = null
const innerValue = ref(props.modelValue || '')
watch(() => props.modelValue, (newValue) => {
	if (easyModeInstance) {
		if (newValue !== innerValue.value) {
			easyModeInstance.value(newValue || '')
		}
	}
})
onMounted(() => {
	if (textArea.value) {
		//组装opitons
		const config: Options = {
			...(props.options || {}),
			element: textArea.value,
			initialValue: innerValue.value,
		}
		easyModeInstance = new EasyMDE(config)
		//监控对应的事件
		easyModeInstance.codemirror.on('change', () => {
			//拿到当前的值
			if (easyModeInstance) {
				const updateValue = easyModeInstance?.value()
				innerValue.value = updateValue
				emit('update:modelValue', updateValue)
				emit('change', updateValue)
			}
		})

		easyModeInstance.codemirror.on('blur', () => {
			if (easyModeInstance) {
				emit('blue')
			}
		})
	}
})
onUnmounted(() => {
	if (easyModeInstance) {
		easyModeInstance.cleanup()
	}
	easyModeInstance = null
})
const clear = () => {
	if (easyModeInstance) {
		easyModeInstance.value('')
	}
}
const getMDEInstance = () => {
	return easyModeInstance
}
defineExpose({ clear, getMDEInstance })
</script>

<template>
	<div class="vue-easymde-editor">
		<textarea ref="textArea"></textarea>
	</div>
</template>

<style scoped>
</style>
