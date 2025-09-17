<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="400" :persistent="true" scrollable>
        <v-card
			:class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'"
		>
            <v-card-text>
                <v-row class="mb-2 mt-2" dense>
                    <v-col>
                        <v-text-field
                            v-model="model.name"
                            label="Name"
                            variant="outlined"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="model.desc"
                            label="Description"
                            variant="outlined"
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <div class="d-flex justify-end align-center">
					<v-btn
						:text="params && params.cancelButtonText ? params.cancelButtonText : 'Cancel'"
						variant="outlined"
                        color="red-darken-3"
						class="text-capitalize mx-2 px-5"
						@click.prevent="closeModal()"
					>
					</v-btn>
					<v-btn
						:text="params && params.confirmButtonText ? params.confirmButtonText : 'Save'"
						:loading="model.isLoading"
                        color="green-darken-3"
						class="text-white text-capitalize px-8"
						@click.prevent="onSubmit()"
					>
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
	name: '',
	desc: '',
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
})

const closeModal = () => {
	store.dispatch('modals/close')
}

const onSubmit = () => {
	model.isSaved = true;

	store
		.dispatch(params.action, {
			name: model.name,
			email: model.email
		})
		.then((response) => {
			that.emitter.emit(params.action);
			Toast.fire({
				icon: 'success',
				title: 'User successfully registered!'
			});
			store.dispatch('modals/close');
			model.isSaved = false;
		})
		.catch((error) => {
			Toast.fire({
				icon: 'error',
				title: 'Something went wrong',
			});

			model.isSaved = false;
		})
}
</script>