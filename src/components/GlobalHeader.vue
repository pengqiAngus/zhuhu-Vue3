<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";
import DropDown from "./DropDown.vue";
import DropDownItem from "./DropDownItem.vue";
export interface UserProps {
	isLogin: boolean,
	name: string,
	id?: string
}
const props = defineProps({
	user: {
		type: Object as PropType<UserProps>,
		required: true
	}
})
</script>

<template>
	<div>
		<nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
			<a class="navbar-brand" href="#">知乎</a>
			<ul v-if="!user.isLogin" class="list-inline mb-0">
				<li class="list-inline-item">
					<router-link to="/login" class="btn btn-outline-light my-2">登录</router-link>
				</li>
				<li class="list-inline-item">
					<router-link to="/login" class="btn btn-outline-light my-2">注册</router-link>
				</li>
			</ul>
			<ul v-else class="list-inline mb-0">
				<DropDown :title="user.name">
					<DropDownItem>
						<router-link class="dropdown-item" to="/createPost">新建文章</router-link>
					</DropDownItem>
					<DropDownItem>
						<router-link class="dropdown-item" to="/login">编辑资料</router-link>
					</DropDownItem>
					<DropDownItem>
						<router-link class="dropdown-item" to="/login">退出登录</router-link>
					</DropDownItem>
				</DropDown>
			</ul>
		</nav>
	</div>
</template>

<style>
</style>
