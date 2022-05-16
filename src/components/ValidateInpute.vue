<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { emitter } from './ValidateForm.vue'
/* eslint vue/no-ref-as-operand: off */
export default defineComponent({
	name: 'Foo',
	inheritAttrs: false

});
</script>
<script lang="ts" setup>
import { rule } from "postcss";
import { PropType, reactive } from "vue";
interface RuleProp {
	type: 'required' | 'email',
	message: string
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'

const props = defineProps({
	rules: {
		type: Array as PropType<RulesProp>,
		required: false
	},
	tag: {
		type: String as PropType<TagType>,
		default: 'input',
	},
	modelValue: String
});
const emit = defineEmits([]);


const emailReg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
const inputRef = reactive({
	val: props.modelValue || '',
	error: false,
	message: ''
})
const refInput = ref<any>()
const updateValue = (e) => {
	const targetValue = (e.target as HTMLInputElement).value
	inputRef.val = targetValue
	emit('update:modelValue', targetValue)
}
const emptyValue = () => {
	inputRef.val = ''
}
const validateInput = () => {
	if (props.rules) {
		const allPassed = props.rules.every(r => {
			let passed = true
			inputRef.message = r.message
			switch (r.type) {
				case 'required':
					passed = (inputRef.val.trim() !== '')
					break;
				case 'email':
					passed = emailReg.test(inputRef.val)
					break
				default:
					break;
			}
			return passed
		})
		inputRef.error = !allPassed
		return allPassed
	}
	return true
}
defineExpose({ validateInput, updateValue, emptyValue })

onMounted(() => {
	emitter.emit('form-item', validateInput)
})
</script>

<template>
	<div class="validate-input-container pb3">
		<input v-if="props.tag !== 'textarea'" :class="{ 'is-invalid': inputRef.error }" v-bind="$attrs"
			class="form-control" :value="inputRef.val" @input="updateValue" @blur="validateInput" />
		<textarea v-else :class="{ 'is-invalid': inputRef.error }" v-bind="$attrs" class="form-control"
			:value="inputRef.val" @input="updateValue" @blur="validateInput" />
		<span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
	</div>
</template>

<style>
</style>
