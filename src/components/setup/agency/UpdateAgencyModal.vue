<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="400" :persistent="true" scrollable>
        <v-card
			:class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'"
		>
            <v-card-text>
                <v-row class="mb-2 mt-2" dense>
                    <v-col>
                        <v-text-field
                            v-model="form.name"
                            label="Agency Name"
                            variant="outlined"
                            required
                        ></v-text-field>

						<v-checkbox label="Default Acronym" v-model="isReadOnly"></v-checkbox>

						<v-text-field
                            v-model="form.acronym"
                            label="Agency Abbreviation"
                            variant="outlined"
							:readonly="isReadOnly"
							:rules="[rules.acronymMax]"
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
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
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

const rules = {
	acronymMax: value => (value || '').length <= 10 || 'Acronym must be 10 characters or less',
}

const form = reactive({})
const fectchData = ref([])
const isReadOnly = ref(true);
const loading = ref(false);

const params = reactive({
	title: modalParams.value.title,
	action: modalParams.value.action,
	confirmButtonClass: modalParams.value.confirmButtonClass,
	cancelButtonClass: modalParams.value.cancelButtonClass,
	type: modalParams.value.type,
    actionParams: modalParams.value.actionParams,
    user: modalParams.value.user,
})

function getAcronym(name) {
	if (!name) return '';
    return name
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .join('');
}

const closeModal = () => {
	store.dispatch('modals/close')
}

const onSubmit = () => {
	model.isSaved = true;

    store
        .dispatch(params.action, {
            agency_id: form.agency_id,
            agency_name: form.name,
            agency_abbr: form.acronym,
        })
        .then((response) => {
            Toast.fire({
                icon: 'success',
                title: 'Agency successfully updated!'
            });

            that.emitter.emit(params.action);
            store.dispatch('modals/close');
            model.isSaved = false;
        })
        .catch((error) => {
            Toast.fire({
                icon: 'error',
                title: 'Something went wrong',
            });

            model.isSaved = false;
            store.dispatch('modals/close');
        })
}

const getData = async () => {
    try {
        const response = await axios.get(`v1/agency/${params.actionParams.agency_id}`);
            fectchData.value = response.data.data;
            form.agency_id = fectchData.value[0].agency_id;
            form.name = fectchData.value[0].agency_name;
            form.acronym = fectchData.value[0].agency_abbr;
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

watch(() => form.name, (newName) => {
	form.acronym = getAcronym(newName);
});

watch(() => model.acronym, (newAcronym) => {
	if(newAcronym !== newAcronym.toUpperCase()) {
		form.acronym = newAcronym.toUpperCase();
	}
});

watch(() => isReadOnly.value, (newValue) => {
	if (newValue) {
		form.acronym = getAcronym(form.name)
	}
})

onBeforeMount(async () => {
    await getData();
});
</script>