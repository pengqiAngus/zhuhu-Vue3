<script setup lang="ts">
import { defineProps } from "vue";
import useDomCreate from "../hooks/useDomCreate";
const props = defineProps({
	title: String,
	visible: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['modal-on-close', 'modal-on-confirm'])
useDomCreate('modal')
const onClose = () => {
	emits('modal-on-close')
}
const onConfirm = () => {
	emits('modal-on-confirm')
}
</script>

<template>
	<teleport to="#modal">
		<div class="modal d-block" tabindex="-1" v-if="visible">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ title }}</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
							@click="onClose"></button>
					</div>
					<div class="modal-body">
						<slot></slot>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="onClose">取消</button>
						<button type="button" class="btn btn-primary" @click="onConfirm">确定</button>
					</div>
				</div>
			</div>
		</div>
	</teleport>
</template>

<style scoped>
</style>
