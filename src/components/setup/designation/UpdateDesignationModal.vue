<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="400" :persistent="true" scrollable>
        <v-card
			:class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'"
		>
            <v-form ref="form" @submit.prevent="validateAndSubmit">
                <v-card-text>
                    <div class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold text-uppercase">
                        {{ params && params.title ? params.title : 'Add Event' }}
                        <v-icon icon="mdi mdi-close" color="red-darken-4" class="cursor-pointer" @click="closeModal()"></v-icon>
                    </div>
                    <div class="d-flex flex-col mb-3">
                        <p class="text-caption font-italic blue-grey-darken-2">All the input fields that has <b class="text-red">*</b> is required.</p>
                    </div>

                    <v-row class="mb-2 mt-2" dense>
                        <v-col>
                            <v-text-field
                                v-model="model.designation"
                                variant="outlined"
                                class="mb-2"
                                :rules="[v => !!v || 'Designation is required']"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        Designation<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <v-text-field
                                v-model="model.office"
                                variant="outlined"
                                class="mb-2"
                                :rules="[v => !!v || 'Office is required']"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        Office<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <v-combobox
                                clearable
                                :items="persons"
                                v-model="model.person"
                                :item-title="item => item.fullname"
                                :item-value="item => item.person_id"
                                variant="outlined"
                                :rules="[v => !!v || 'Person is required']"
                                class="mb-2"
                            >
                                <template v-slot:label>
                                    <div>
                                        Person<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-combobox>

                            <v-combobox
                                clearable
                                :items="meetings"
                                v-model="model.meeting"
                                :item-title="item => item.meeting_title"
                                :item-value="item => item.meeting_id"
                                variant="outlined"
                                :rules="[v => !!v || 'Meeting is required']"
                                class="mb-2"
                            >
                                <template v-slot:label>
                                    <div>
                                        Meeting<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-combobox>
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
                            @click="validateAndSubmit()"
                        >
                        </v-btn>
                    </div>
                </v-card-text>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
let that = self;

const loading = ref(false);
const isReadOnly = ref(true);
const name = ref('');
const form = ref(null);
const persons = ref([]);
const meetings = ref([]);
const fectchData = ref([]);

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
	designation: null,
    office: null,
    person: null,
    meeting: null,
    pd_id: null,
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

const onSubmit = () => {
	model.isSaved = true;

    store
        .dispatch(params.action, {
            pd_id: model.pd_id,
            designation: model.designation,
            office: model.office,
            meeting_id: model.meeting.meeting_id,
            person_id: model.person.person_id,
        })
        .then((response) => {
            Toast.fire({
                icon: 'success',
                title: 'Designation successfully updated!'
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

const validateAndSubmit = async () => {
    const { valid } = await form.value.validate();

    if (valid) {
        onSubmit();
    }
};

const getData = async () => {
    try {
        const response = await axios.get(`v1/person_desig/${params.actionParams.pd_id}`);
            fectchData.value = response.data.data;
            model.pd_id = fectchData.value[0].pd_id;
            model.designation = fectchData.value[0].designation;
            model.office = fectchData.value[0].office;
            model.person = fectchData.value[0].person_details.id;
            model.meeting = fectchData.value[0].meeting_details.id;
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};


const getPersons = async () => {
    model.isLoading = true; 
    try {
        const response = await axios.get("v1/person");
        persons.value = response.data.data;
    } catch (error) {
        console.error("Error fetching list:", error);
    } finally {
        model.isLoading = false;
    }
}

const getMeetings = async () => {
    model.isLoading = true; 
    try {
        const response = await axios.get("v1/meeting");
        meetings.value = response.data.data;
    } catch (error) {
        console.error("Error fetching list:", error);
    } finally {
        model.isLoading = false;
    }
}

onBeforeMount(async () => {
    await getData();
    await getPersons();
    await getMeetings();
});

</script>