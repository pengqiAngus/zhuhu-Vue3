<template>
	<div class="login-page">
		<validate-form @form-submit="onFormSubmit">
			<div class="mb-3">
				<label class="form-label">邮箱地址</label>
				<validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" ref="inputRef" />
			</div>
			<div class="mb-3">
				<label class="form-label">用户名</label>
				<validate-input :rules="normalRules" v-model="nickName" placeholder="请输入用户名" type="text" ref="inputRef" />
			</div>
			<div class="mb-3">
				<label class="form-label">密码</label>
				<validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
			</div>
			<div class="mb-3">
				<label class="form-label">重复密码</label>
				<validate-input type="password" placeholder="请输入密码" :rules="repPasswordRules" v-model="repPasswordVal" />
			</div>
			<template #submit>
				<button type="submit" class="btn btn-primary">注册</button>
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
		const nickName = ref('')
		const normalRules: RulesProp = [
			{ type: 'required', message: '用户名不能为空' }
		]
		const passwordVal = ref('')
		const passwordRules: RulesProp = [
			{ type: 'required', message: '密码不能为空' }
		]
		const repPasswordVal = ref('')
		const repPasswordRules: RulesProp = [
			{ type: 'required', message: '密码不一致' },
			{
				type: 'custom', validator: () => {
					return passwordVal.value === repPasswordVal.value
				},
				message: '密码不一致'
			},
		]

		const router = useRouter()
		const store = useStore()
		const onFormSubmit = (result: boolean) => {
			if (result) {
				const playload = { email: emailVal.value, nickName: nickName.value, password: passwordVal.value }
				store.dispatch('register', playload).then(s => {
					useCreateMessage('注册成功,请登录~~', 'success', 2000)
					router.push({ path: '/login' })
				}).catch(e => {
					console.log(e);
				})
			}
		}

		return {
			emailRules,
			emailVal,
			nickName,
			passwordVal,
			passwordRules,
			repPasswordVal,
			repPasswordRules,
			normalRules,
			onFormSubmit
		}
	}
})
</script>