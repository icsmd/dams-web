<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="1200" :persistent="true" scrollable>
        <v-card
			:class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'"
		>
            <v-form ref="form" @submit.prevent="validateAndSubmit">
                <v-card-text>
                    <div class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold text-uppercase">
                        {{ params && params.title ? params.title : 'Add person' }}
                        <v-icon icon="mdi mdi-close" color="red-darken-4" class="cursor-pointer" @click="closeModal()"></v-icon>
                    </div>
                    <div class="d-flex flex-col mb-3">
                        <p class="text-caption font-italic blue-grey-darken-2">All the input fields that has <b class="text-red">*</b> is required.</p>
                    </div>

                    <div class="d-flex flex-row w-100 justify-center align-center">
                        <div class="d-flex flex-column justify-center align-center w-100 ga-5">
                            <v-img 
                                :src="profilePicPreview"
                                v-if="profilePicPreview"
                                width="300"
                                height="300"
                                aspect-ratio="1"
                                cover
                                class="rounded-lg border-2"
                            ></v-img>

                            <v-file-input
                                v-model="model.profile_pic"
                                label="Profile Picture"
                                variant="outlined"
                                prepend-icon=""
                                accept="image/*"
                                class="w-75 mb-3"
                                counter
                                show-size
                                @change="onFileSelected($event)"
                            >
                                <template v-slot:prepend-inner>
                                    <v-icon color="grey-darken-4" class="mr-2">mdi-camera</v-icon>
                                </template>
                                <template v-slot:selection="{ fileNames }">
                                    <template v-for="fileName in fileNames" :key="fileName">
                                        <v-chip
                                            class="me-2"
                                            color="primary"
                                            size="small"
                                            label
                                        >
                                            {{ fileName }}
                                        </v-chip>
                                    </template>
                                </template>
                            </v-file-input>
                        </div>

                        <div class="d-flex flex-column justify-space-between w-100">
                            <v-row class="mb-2 mt-2" dense>
                                <v-col>
                                    <div class="d-flex flex-row ga-2 w-100 mb-3">
                                        <v-text-field
                                            v-model="model.prefix"
                                            variant="outlined"
                                            class="w-25 m-2"
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
                                            class="w-50 m-2"
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
                                            class="w-50 m-2"
                                        ></v-text-field>

                                        <v-text-field
                                            v-model="model.lastname"
                                            variant="outlined"
                                            :rules="[v => !!v || 'Last Name is required']"
                                            class="w-50 m-2"
                                            required
                                        >
                                            <template v-slot:label>
                                                <div>
                                                    Last Name<span class="text-red">*</span>
                                                </div>
                                            </template>
                                        </v-text-field>
                                    </div>

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

                                        <v-text-field
                                            v-model="model.rfid"
                                            label="RFID"
                                            variant="outlined"
                                            class="w-50 m-2"
                                        ></v-text-field>
                                    </div>

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
                        </div>
                    </div>
                </v-card-text>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, watch, onBeforeUnmount  } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
let that = self;

const loading = ref(false);
const isReadOnly = ref(true);
const name = ref('');
const form = ref(null);

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

const defaultImage = '/public/img/user.jpg';

const profilePicPreview = computed(() => {
  if (model.profile_pic) {
    // If a file is selected, create a URL for the preview
    return URL.createObjectURL(model.profile_pic);
  } else {
    // Otherwise, use the default image
    return defaultImage;
  }
});

const onFileSelected = (event) => {
    const files = event.target.files;
};

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

    if (model.profile_pic != null) {
        const file = model.profile_pic;
        const fileData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileExtension = file.name.split('.').pop();
                resolve({
                    name: file.name,
                    type: file.type,
                    ext: fileExtension,
                    size: file.size,
                    content: reader.result.split(',')[1],
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    store
        .dispatch(params.action, {
            firstname: model.firstname,
            middlename: model.middlename,
            lastname: model.lastname,
            prefix: model.prefix,
            sex: model.sex,
            type: model.type.type,
            rfid: model.rfid,
            agency_id: model.agency.agency_id,
            profile_pic: model.profile_pic != null ? fileData.content : null,
            status: 'Active',
        })
        .then((response) => {
            Toast.fire({
                icon: 'success',
                title: 'Person successfully registered!'
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

onBeforeMount(async () => {
    await getAgencies();
});

onBeforeUnmount(() => {
    if (model.profile_pic) {
        URL.revokeObjectURL(profilePicPreview.value);
    }
});
</script>