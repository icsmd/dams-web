<template>
    <v-dialog v-if="!model.isSaved" v-model="model.dialog" width="1200" :persistent="true" scrollable>
        <v-card
			:class="params && params.borderTopClass ? params.borderTopClass : 'border-top-yellow-gold'"
		>
            <v-card-text>
                <div class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold text-uppercase mb-3">
                    {{ params && params.title ? params.title : 'Add person' }}
                    <v-icon icon="mdi mdi-close" color="red-darken-4" class="cursor-pointer" @click="closeModal()"></v-icon>
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
                            readonly 
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
                                        readonly
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
                                        readonly
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
                                        readonly
                                    ></v-text-field>

                                    <v-text-field
                                        v-model="model.lastname"
                                        variant="outlined"
                                        class="w-50 m-2"
                                        readonly
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
                                        readonly
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
                                        item-value="type"
                                        variant="outlined"
                                        class="w-25 m-2"
                                        readonly
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
                                        readonly
                                    ></v-text-field>
                                </div>

                                <v-text-field
                                    v-model="model.agency"
                                    label="Agency"
                                    variant="outlined"
                                    class="mb-2"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-card-text>
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
const fectchData = ref([])

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
    person_id: null,
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

const getData = async () => {
    try {
        const response = await axios.get(`v1/person/${params.actionParams.person_id}`);
            fectchData.value = response.data.data;
            model.person_id = fectchData.value[0].person_id;
            model.firstname = fectchData.value[0].firstname;
            model.middlename = fectchData.value[0].middlename;
            model.lastname = fectchData.value[0].lastname;
            model.prefix = fectchData.value[0].prefix;
            model.sex = fectchData.value[0].sex;
            model.type = fectchData.value[0].type == 'R' ? getType[0] : getType[1];
            model.rfid = fectchData.value[0].rfid;
            model.agency = fectchData.value[0].agency_details.abbr + ' | ' + fectchData.value[0].agency_details.name;
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

onBeforeUnmount(() => {
    if (model.profile_pic) {
        URL.revokeObjectURL(profilePicPreview.value);
    }
});

onBeforeMount(async () => {
    await getData();
});
</script>