<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="500" persistent scrollable>
        <v-card :class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'">
            <v-card-text class="text-center">
				<v-icon
					color="red-darken-1"
					icon="mdi mdi-alert-circle"
					size="100"
				></v-icon>
                <h1 class="text-h4 text-navy-blue text-center font-weight-bold my-5">
                    {{ params && params.title ? params.title : '' }}
                </h1>
                <p class="text-navy-blue text-center">
                    {{ params && params.message ? params.message : '' }}
                </p>
                <div class="d-flex justify-center align-center my-5">
                    <v-btn
						color="red-darken-2"
                        class="text-uppercase mx-2 px-5"
                        variant="outlined"
                        @click.prevent="closeModal"
                    >
                        {{ params && params.cancelButtonText ? params.cancelButtonText : 'Cancel' }}
                    </v-btn>
                    <v-btn
                        class="text-uppercase text-white"
						color="green-darken-3"
                        :loading="loading"
                        variant="flat"
                        @click.prevent="onSubmit"
                    >
                        {{ params && params.confirmButtonText ? params.confirmButtonText : 'Save' }}
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, onBeforeMount, reactive } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
let that = self;

const modalState = computed(() => {
	return store.getters['modals/activeModal']
})

const modalParams = computed(() => {
	return store.getters['modals/modalParams']
})

const model = reactive({
	dialog: true,
	isLoading: false,
	isSaved: false,
})

const params = reactive({
	title: modalParams.value.title,
	message: modalParams.value.message,
	successMessage: modalParams.value.successMessage,
	action: modalParams.value.action,
	confirmButtonText: modalParams.value.confirmButtonText,
	cancelButtonText: modalParams.value.cancelButtonText,
	actionParams: modalParams.value.actionParams,
	icon: modalParams.value.icon,
	iconColor: modalParams.value.iconColor,
	borderTopClass: modalParams.value.borderTopClass,
	confirmButtonClass: modalParams.value.confirmButtonClass,
	cancelButtonClass: modalParams.value.cancelButtonClass,
    user: modalParams.value.user,
})

const closeModal = () => {
	store.dispatch('modals/close')
}

const onSubmit = async () => {
    model.isSaved = true;

    const response1 = await axios.delete(`v1/agency/${params.actionParams.agency_id}`, params.actionParams);

    that.emitter.emit('destroy');
    Toast.fire({
        icon: 'success',
        title: params.toastMessage ? params.toastMessage : 'Transaction has been deleted successfully.',
    });

    store.dispatch('modals/close');
}

onBeforeMount(() => {
	model.dialog = modalState.value === 'delete-agency-modal' ? true : false
})
</script>

<style scoped></style>
