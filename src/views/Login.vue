<template>
	<div class="login-page">
		<validate-form @form-submit="onFormSubmit">
			<div class="mb-3">
				<label class="form-label">邮箱地址</label>
				<validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" ref="inputRef" />
			</div>
			<div class="mb-3">
				<label class="form-label">密码</label>
				<validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
			</div>
			<template #submit>
				<button type="submit" class="btn btn-primary">登录</button>
			</template>
		</validate-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from "../components/ValidateInpute.vue"
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
import ValidateForm from '../components/ValidateForm.vue'
import useCreateMessage from "../hooks/useCreateMessage";

export default defineComponent({
	name: 'Login',
	components: {
		ValidateInput,
		ValidateForm
	},
	setup() {
		const emailVal = ref('')
		const emailRules: RulesProp = [
			{ type: 'required', message: '电子邮箱地址不能为空' },
			{ type: 'email', message: '请输入正确的电子邮箱格式' }
		]
		const passwordVal = ref('')
		const passwordRules: RulesProp = [
			{ type: 'required', message: '密码不能为空' }
		]
		const router = useRouter()
		const store = useStore()
		const onFormSubmit = (result: boolean) => {
			if (result) {
				const playload = { email: emailVal.value, password: passwordVal.value }
				store.dispatch('loginAndFecth', playload).then(s => {
					useCreateMessage('登录成功', 'success', 2000)
					router.push({ path: '/' })
				}).catch(e => {
					console.log(e);
				})
			}
		}

		return {
			emailRules,
			emailVal,
			passwordVal,
			passwordRules,
			onFormSubmit
		}
	}
})
</script>