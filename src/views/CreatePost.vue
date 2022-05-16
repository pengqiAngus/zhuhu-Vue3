<template>
	<div class="login-page">
		<h4>新建文章</h4>
		<validate-form @form-submit="onFormSubmit">
			<div class="mb-3">
				<label class="form-label">文章标题：</label>
				<validate-input :rules="titleRule" v-model="titleVal" placeholder="请输入文章标题" type="text" ref="inputRef" />
			</div>
			<div class="mb-3">
				<label class="form-label">文章内容：</label>
				<validate-input tag="textarea" rows="10" type="text" placeholder="请输入文章内容" v-model="contentVal" />
			</div>
			<template #submit>
				<button type="submit" class="btn btn-primary">创建</button>
			</template>
		</validate-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from "../components/ValidateInpute.vue"
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
import { GlobalDataProps } from "../store";
import { PostProps } from "../store";
import ValidateForm from '../components/ValidateForm.vue'

export default defineComponent({
	name: 'CreatePost',
	components: {
		ValidateInput,
		ValidateForm
	},
	setup() {
		const titleVal = ref('')
		const contentVal = ref('')
		const titleRule: RulesProp = [{ type: 'required', message: '标题不能为空' }]
		const router = useRouter()
		const store = useStore<GlobalDataProps>()
		const onFormSubmit = (result: boolean) => {
			if (result) {
				const { columnId } = store.state.user
				if (columnId) {
					const newPost: PostProps = {
						id: new Date().getTime(),
						title: titleVal.value,
						content: contentVal.value,
						columnId,
						createdAt: new Date().toLocaleString()
					}
					store.commit('creatPost', newPost)
					router.push({ name: 'columnDetail', params: { id: columnId } })
				}

			}
		}

		return {
			titleRule, titleVal, contentVal,
			onFormSubmit
		}
	}
})
</script>