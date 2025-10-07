<template>
    <v-app-bar color="brown-lighten-2">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Agency</div>
        <v-divider vertical length="40" class="mx-3 my-auto"></v-divider>
        <v-breadcrumbs :items="getBreadcrumbs" class="pr-13 text-subtitle-2">
            <template v-slot:title="{ item }">
                {{ item.title.toUpperCase() }}
            </template>
            <template v-slot:divider>
                <v-icon icon="mdi mdi-chevron-right" size="10"></v-icon>
            </template>
        </v-breadcrumbs>
    </v-app-bar>
    <v-main class="pa-5">
        <v-container fluid>
            <v-card flat>
                <v-card-text>
                    <v-row class="align-center" no-gutters>
                        <v-col cols="12" md="auto" class="mb-2 mb-md-0">
                            <v-btn 
                                prepend-icon="mdi mdi-plus-circle" 
                                variant="elevated"
                                color="green-darken-3"
                                @click="addItem"
                            >
                                Add Agency
                            </v-btn>
                        </v-col>
                        <v-spacer class="d-none d-md-flex" />
                        <v-col cols="12" md="4">
                            <v-text-field
                                append-inner-icon="mdi mdi-magnify"
                                density="compact"
                                label="Type keywords to search"
                                variant="outlined"
                                hide-details
                                single-line
                                v-model="search"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="filteredItems"
                        v-model="selected"
                        show-select
                        :items-per-page="itemsPerPage"
                        :page="page"
                        @update:page="page = $event"
                        :footer-props="{
                            'items-per-page-options': [5, 10, 20, 50],
                            'items-per-page-text': 'Rows per page:'
                        }"
                        :loading="loading"
                    >
                        <template #item.created_at="{ item }">
                            {{ that.toReadableDateTime(item.created_at) }}
                        </template>

                        <template #item.status="{ item }">
                            <v-chip
                                class="ma-2 font-weight-bold"
                                :color="item.status === 'Active' ? 'green' : 'red'"
                                label
                                >
                                {{ item.status === 'Active' ? 'Active' : 'Archived' }}
                            </v-chip>
                        </template>

                        <template #item.actions="{ item }">
                            <v-menu>
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" color="primary" />
                                </template>
                                <v-list>
                                    <v-list-item @click="updateItem(item)">
                                        <v-list-item-title>
                                            <v-icon start icon="mdi-pencil" color="orange" /> Edit
                                        </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="deleteItem(item)">
                                        <v-list-item-title>
                                            <v-icon start icon="mdi-delete" color="red" /> Delete
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>

    <CreateAgencyModal v-if="store.getters['modals/activeModal'] === 'create-agency-modal'" />
    <UpdateAgencyModal v-if="store.getters['modals/activeModal'] === 'update-agency-modal'" />
    <DeleteAgencyModal v-if="store.getters['modals/activeModal'] === 'delete-agency-modal'" />
</template>
<script setup>
import { onBeforeMount, ref, onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import pako from "pako";

import CreateAgencyModal from "@/components/setup/agency/CreateAgencyModal.vue";
import UpdateAgencyModal from "@/components/setup/agency/UpdateAgencyModal.vue";
import DeleteAgencyModal from "@/components/setup/agency/DeleteAgencyModal.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;
const display = useDisplay();
const items = ref([]);

const model = reactive({
    userDetails: null,
    userPid: null,
    tokenDetails: null,
});

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'System Setup', disabled: true, href: 'breadcrumbs_link_1' },
    { title: 'Agency', disabled: false, href: '' },
];

const headers = [
    { title: 'Agency No.', key: 'sys_id', class: 'text-center' },
    { title: 'Name', key: 'agency_name', class: 'text-center' },
    { title: 'Abbreviation', key: 'agency_abbr', class: 'text-center' },
    { title: 'Status', key: 'status', class: 'text-center' },
    { title: 'Created At', key: 'created_at', sortable: false, class: 'text-center' },
    { title: 'Actions', key: 'actions', sortable: false, class: 'text-center' }
];

const search = ref("");
const selected = ref([]);
const page = ref(1);
const itemsPerPage = ref(5);

const filteredItems = computed(() => {
    if (!search.value) return items.value;
    return items.value.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(search.value.toLowerCase())
        )
    );
});

const addItem = () => {
    store.dispatch("modals/open", {
        name: "create-agency-modal",
        params: {
            title: "",
            action: "agency/save",
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            user: getFullNameInitial(model.userDetails),
        },
    });
}

const updateItem = (item) => {
    store.dispatch("modals/open", {
        name: "update-agency-modal",
        params: {
            title: "",
            action: "agency/update",
            confirmButtonText: "Update",
            cancelButtonText: "Cancel",
            actionParams: item,
            user: getFullNameInitial(model.userDetails),
        },
    });
}

const deleteItem = (item) => {
    store.dispatch("modals/open", {
        name: "delete-agency-modal",
        params: {
            title: "",
            message: "Are you sure you want to delete this Agency?",
            toastMessage: "Agency has been deleted successfully.",
            action: "agency/delete",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            actionParams: item,
            user: getFullNameInitial(model.userDetails),
        },
    });
}

const getCookie = (name) => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const decompressPayload = (base64String) => {
  let binary = atob(base64String);
  let bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  let json = pako.inflate(bytes, { to: "string" });

  return JSON.parse(json);
}

const getUserSession = () => {
    model.userDetails = decompressPayload(getCookie('session_user'));
    model.tokenDetails = decompressPayload(getCookie('session_token'));
}

const getList = async () => {
    try {
        const response = await axios.get("v1/agency");
        items.value = response.data.data.filter(item => item.status === 'Active');

        console.log(items.value);
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

onMounted(() => {
    that.emitter.on("agency/save", async () => {
        await getList();
    });

    that.emitter.on("agency/update", async () => {
        await getList();
    });

    that.emitter.on("destroy", async () => {
        await getList();
    });
})

onBeforeMount(async () => {
    await getList();
    await getUserSession();
    
    store.dispatch("references/setHeaderTitle", "Digital Attendance Monitoring System");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>