<script setup>
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { RouterView } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
</script>

<template>
	<v-app>
		<v-main>
			<RouterView />
		</v-main>
		<ConfirmModal v-if="store.getters['modals/activeModal'] === 'confirm-modal'" />
	</v-app>
</template>
