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
                                v-model="model.name"
                                variant="outlined"
                                :rules="[v => !!v || 'Prefix is required']"
                                class="mb-3"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        Event Title<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <v-text-field
                                v-model="model.venue"
                                variant="outlined"
                                :rules="[v => !!v || 'Prefix is required']"
                                class="mb-3"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        Event Venue<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <v-text-field
                                :model-value="formattedDate"
                                label="Event Date"
                                prepend-icon=""
                                variant="outlined"
                                readonly
                            >
                                <template v-slot:prepend-inner>
                                    <v-icon color="grey-darken-4" class="mr-2">mdi-calendar-month</v-icon>
                                </template>
                                <v-dialog v-model="showDialogDate" activator="parent" width="auto">
                                    <v-date-picker
                                        v-model="model.date"
                                        color="brown-darken-2"
                                    ></v-date-picker>
                                </v-dialog>
                            </v-text-field>

                            <v-text-field
                                :model-value="model.time"
                                label="Event Time"
                                prepend-icon=""
                                variant="outlined"
                                readonly
                            >
                                <template v-slot:prepend-inner>
                                    <v-icon color="grey-darken-4" class="mr-2">mdi-clock-time-four-outline</v-icon>
                                </template>
                                <v-dialog v-model="showDialog" activator="parent" width="auto">
                                    <v-time-picker v-model="model.time" format="24hr"></v-time-picker>
                                </v-dialog>
                            </v-text-field>
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
const showDialog = ref(false)
const showDialogDate = ref(false)
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
	name: null,
    venue: null,
	date: null,
    time: null,
    meeting_id: null,
    event_id: null,
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
    meeting_id: modalParams.value.meeting_id,
    user: modalParams.value.user,
})

const closeModal = () => {
	store.dispatch('modals/close')
}

const formattedDate = computed(() => {
    if (!model.date) {
        return '';
    }

    const date = new Date(model.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
});

const onSubmit = () => {
	model.isSaved = true;

    store
        .dispatch(params.action, {
            event_id: model.event_id,
            meeting_id: model.meeting_id,
            event_title: model.name,
            event_venue: model.venue,
            event_date: formattedDate.value,
            event_time: model.time,
        })
        .then((response) => {
            Toast.fire({
                icon: 'success',
                title: 'Event successfully created!'
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
        const response = await axios.get(`v1/events/${params.actionParams.event_id}`);
            fectchData.value = response.data.data;
            model.event_id = fectchData.value[0].event_id;
            model.name = fectchData.value[0].event_title;
            model.venue = fectchData.value[0].event_venue;
            model.date = fectchData.value[0].event_date;
            model.time = fectchData.value[0].event_time;
            model.meeting_id = fectchData.value[0].meeting_id;
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

onBeforeMount(async () => {
    await getData();
});
</script>