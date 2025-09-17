<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const BlankLayout = 'blank'

const layout = computed(() => {
	return `${route.meta.layout || BlankLayout}-layout`
})

console.log("test", route.meta.layout);
</script>

<template>
	<v-app>
		<component :is="layout">
			<RouterView />
		</component>
	</v-app>
</template>
