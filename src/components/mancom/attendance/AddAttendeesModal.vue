<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="500" :persistent="true" scrollable>
        <v-card
			:class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'"
		>
            <v-card-text>
                <div class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold text-uppercase">
                    {{ params && params.title ? params.title : 'Add Attendees' }}
                    <v-icon icon="mdi mdi-close" color="red-darken-4" class="cursor-pointer" @click="closeModal()"></v-icon>
                </div>

                <div class="d-flex flex-row w-100 justify-center align-center mt-5">
                    <div class="d-flex flex-column align-center w-100">
                        <v-combobox
                            class="w-100"
                            v-model="model.attendees"
                            :items="persons"
                            :item-title="item => item.fullname"
                            :item-value="item => item"
                            variant="outlined"
                            chips
                            closable-chips
                            multiple
                        >
                            <template v-slot:chip="{ props, item }">
                                <v-chip v-bind="props" label>
                                    <template v-slot:close>
                                        <v-icon icon="$close" size="14"></v-icon>
                                    </template>
                                </v-chip>
                            </template>

                            <template v-slot:label>
                                <div>
                                    Attendees<span class="text-red">*</span>
                                </div>
                            </template>
                        </v-combobox>
                    </div>
                </div>

                <div class="d-flex justify-space-between align-center">
                    <v-btn 
                        text="Manual Entry"
                        color="blue-darken-4"
                        @click="openManual()"
                    ></v-btn>

                    <div>
                        <v-btn
                            :text="params && params.cancelButtonText ? params.cancelButtonText : 'Cancel'"
                            variant="outlined"
                            color="red-darken-3"
                            class="mx-2 px-5"
                            @click.prevent="closeModal()"
                        >
                        </v-btn>
                        <v-btn
                            :text="params && params.confirmButtonText ? params.confirmButtonText : 'Save'"
                            :loading="model.isLoading"
                            color="green-darken-3"
                            class="text-white px-8"
                            @click="onSubmit()"
                        >
                        </v-btn>
                    </div>
                </div>
            </v-card-text>

            <!-- MANUAL ENTRY FOR NOT REGISTERED -->
            <v-dialog v-model="showManualDialog" max-width="400px">
                <v-card>
                    <v-card-text>
                        <div class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold text-uppercase mb-2">
                            Person Manual Entry
                        </div>
                        <v-form ref="form" @submit.prevent="validateAndSubmit" class="w-100">
                            <v-text-field
                                v-model="model.prefix"
                                variant="outlined"
                                class="mb-2"
                                :rules="[v => !!v || 'Prefix is required']"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        Prefix<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <v-text-field
                                v-model="model.firstname"
                                variant="outlined"
                                class="mb-2"
                                :rules="[v => !!v || 'First name is required']"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        First Name<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <v-text-field
                                v-model="model.middlename"
                                label="Middle Name"
                                variant="outlined"
                                class="mb-2"
                            ></v-text-field>

                            <v-text-field
                                v-model="model.lastname"
                                variant="outlined"
                                :rules="[v => !!v || 'Last Name is required']"
                                class="mb-2"
                                required
                            >
                                <template v-slot:label>
                                    <div>
                                        Last Name<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-text-field>

                            <div class="d-flex flex-row ga-2 w-100 mb-3">
                                <v-select
                                    v-model="model.sex"
                                    :items="['Male', 'Female']"
                                    variant="outlined"
                                    class="w-25 m-2"
                                    :rules="[v => !!v || 'Sex is required']"
                                    required
                                >
                                    <template v-slot:label>
                                        <div>
                                            Sex<span class="text-red">*</span>
                                        </div>
                                    </template>
                                </v-select>

                                <v-select
                                    v-model="model.type"
                                    :items="getType"
                                    :item-title="item => item.name"
                                    variant="outlined"
                                    :rules="[v => !!v || 'Enroll Type is required']"
                                    class="w-25 m-2"
                                    required
                                >
                                    <template v-slot:label>
                                        <div>
                                            Type<span class="text-red">*</span>
                                        </div>
                                    </template>
                                </v-select>
                            </div>

                            <v-text-field
                                v-model="model.rfid"
                                label="RFID"
                                variant="outlined"
                                class="mb-2"
                            ></v-text-field>

                            <v-combobox
                                clearable
                                :items="agencies"
                                v-model="model.agency"
                                :item-title="item => item.agency_abbr + ' | ' + item.agency_name"
                                variant="outlined"
                                :rules="[v => !!v || 'Agency is required']"
                                class="mb-2"
                            >
                                <template v-slot:label>
                                    <div>
                                        Agency<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-combobox>
                        </v-form>
                        <div class="d-flex justify-end align-center">
                            <v-btn
                                :text="params && params.cancelButtonText ? params.cancelButtonText : 'Cancel'"
                                variant="outlined"
                                color="red-darken-3"
                                class="mx-2 px-5"
                                @click.prevent="closeDialog()"
                            >
                            </v-btn>
                            <v-btn
                                text="Save"
                                :loading="model.isLoading"
                                color="green-darken-3"
                                class="px-8"
                                @click="validateAndSubmit()"
                            >
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, watch, onBeforeUnmount, onMounted  } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
let that = self;

const loading = ref(false);
const isReadOnly = ref(true);
const name = ref('');
const form = ref(null);
const showManualDialog = ref(false);

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
    isManual: false,
    lastname: null,
	firstname: null,
	middlename: null,
    prefix: null,
    sex: null,
    type: null,
    rfid: null,
    agency: null,
    profile_pic: null,
})

const persons = ref([]);
const agencies = ref([]);

const getType = [
    {
        "id": 1,
        "name": "Regular",
        "type": "R",
    },
    {
        "id": 2,
        "name": "Manual",
        "type": "M",
    },
]

const params = reactive({
	title: modalParams.value.title,
	message: modalParams.value.message,
	successMessage: modalParams.value.successMessage,
	action: modalParams.value.action,
    actionManual: modalParams.value.actionManual,
	confirmButtonText: modalParams.value.confirmButtonText,
	cancelButtonText: modalParams.value.cancelButtonText,
	actionParams: modalParams.value.actionParams,
	icon: modalParams.value.icon,
	iconColor: modalParams.value.iconColor,
	borderTopClass: modalParams.value.borderTopClass,
	confirmButtonClass: modalParams.value.confirmButtonClass,
	cancelButtonClass: modalParams.value.cancelButtonClass,
    event_id: modalParams.value.event_id,
    user: modalParams.value.user,
})

const closeModal = () => {
	store.dispatch('modals/close')
}

const closeDialog = () => {
    showManualDialog.value = false;
}

const openManual = () => {
    showManualDialog.value = true;
};

const onSubmit = () => {
    model.isSaved = true;

    const attendees = model.attendees;

    if (!attendees || attendees.length === 0) {
        Toast.fire({
            icon: 'warning',
            title: 'Please select at least one attendee.'
        });
        model.isSaved = false;
        return;
    }


    const savePromises = attendees.map(attendee => {
        return store.dispatch(params.action, {
            person_id: attendee.person_id,
            event_id: parseInt(params.event_id),
        });
    });

    Promise.all(savePromises)
        .then(() => {
            Toast.fire({
                icon: 'success',
                title: 'Attendees successfully registered!'
            });

            that.emitter.emit(params.action);
            store.dispatch('modals/close');
            model.isSaved = false;
        })
        .catch((error) => {
            console.error('Error saving attendees:', error);
            Toast.fire({
                icon: 'error',
                title: 'Something went wrong while saving one or more attendees.'
            });

            model.isSaved = false;
            store.dispatch('modals/close');
        });
};

const onSubmitManual = async () => {
	model.isSaved = true;

    store
        .dispatch(params.actionManual, {
            firstname: model.firstname,
            middlename: model.middlename,
            lastname: model.lastname,
            prefix: model.prefix,
            sex: model.sex,
            type: model.type.type,
            rfid: model.rfid,
            agency_id: model.agency.agency_id,
            status: 'Active',
        })
        .then((response) => {
            Toast.fire({
                icon: 'success',
                title: 'Person successfully registered!'
            });

            model.firstname = null;
            model.middlename = null;
            model.lastname = null;
            model.prefix = null;
            model.sex = null;
            model.type = null;
            model.rfid = null;
            model.agency = null;

            that.emitter.emit(params.actionManual);
            closeDialog();
            model.isSaved = false;
        })
        .catch((error) => {
            Toast.fire({
                icon: 'error',
                title: 'Something went wrong',
            });

            model.isSaved = false;
            closeDialog();
        })
}

const validateAndSubmit = async () => {
    const { valid } = await form.value.validate();

    if (valid) {
        onSubmitManual();
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

const getAgencies = async () => {
    model.isLoading = true; 
    try {
        const response = await axios.get("v1/agency");
        agencies.value = response.data.data;
    } catch (error) {
        console.error("Error fetching list:", error);
    } finally {
        model.isLoading = false;
    }
}

onMounted(() => {
    that.emitter.on("person/save", async () => {
        await getPersons();
    });
})

onBeforeMount(async () => {
    await getPersons();
    await getAgencies();
});
</script>