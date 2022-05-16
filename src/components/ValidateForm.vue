<script lang="ts">
import { computed, defineComponent, defineProps, onUnmounted, PropType } from "vue";
import mitt from 'mitt'

type Events = {
	'form-item': ValidateFunc
}
type ValidateFunc = () => boolean
export const emitter = mitt<Events>()
export default defineComponent({
	emits: ['formSubmit'],
	setup(props, context) {
		let funcArr: ValidateFunc[] = []
		const submit = () => {
			const result = funcArr.map(func => func()).every(r => r)
			context.emit('formSubmit', result)
		}
		const callback = (func: ValidateFunc) => {
			funcArr.push(func)

		}
		emitter.on('form-item', callback)
		onUnmounted(() => {
			emitter.off('form-item', callback)
			funcArr = []
		})
		return { submit }
	}
})


</script>

<template>
	<div class="validate-form-container">
		<slot name="default"></slot>
		<div class="submit-area" @click.prevent="submit">
			<slot name="submit">
				<button type="submit" class="btn btn-primary">提交</button>
			</slot>
		</div>
	</div>
</template>

<style>
</style>
