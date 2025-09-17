<template>
	<v-app>
		<v-layout>
			<v-main class="d-flex align-center justify-center">
				<div class="pa-0 h-100 w-100">
					<RouterView />
				</div>
			</v-main>
		</v-layout>
	</v-app>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
