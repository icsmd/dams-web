<template>
    <v-app-bar color="blue-grey-lighten-4">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Primary Intel Type</div>
        <v-divider vertical length="40" class="mx-3 my-auto"></v-divider>
        <v-breadcrumbs :items="getBreadcrumbs" class="pr-13 text-subtitle-2">
            <template v-slot:title="{ item }">
                {{ item.title.toUpperCase() }}
            </template>
            <template v-slot:divider>
                <v-icon icon="mdi mdi-chevron-right" size="20"></v-icon>
            </template>
        </v-breadcrumbs>
    </v-app-bar>
    <v-main class="pa-5">
        <v-container fluid>
            <v-card flat>
                <v-card-text class="d-flex justify-space-between">
                    <v-btn 
                        prepend-icon="mdi mdi-plus" 
                        variant="elevated"
                        color="green-darken-3"
                        @click="addItem()"
                    >
                        Add Intel Primary Type
                    </v-btn>
                    <div class="w-25">
                        <v-text-field
                            append-inner-icon="mdi mdi-magnify"
                            density="compact"
                            label="Type keywords to search"
                            variant="outlined"
                            hide-details
                            single-line
                            v-model="search"
                        ></v-text-field>
                    </div>
                </v-card-text>
                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="filteredItems"
                        v-model="selected"
                        show-select
                        :item-value="'ipt_id'"
                        :items-per-page="itemsPerPage"
                        :page="page"
                        @update:page="page = $event"
                        :footer-props="{
                            'items-per-page-options': [5, 10, 20, 50],
                            'items-per-page-text': 'Rows per page:'
                        }"
                    >
                        <template #item.actions="{ item }">
                            <v-btn icon="mdi-eye" variant="text" color="primary" @click="viewItem(item)" />
                            <v-btn icon="mdi-pencil" variant="text" color="orange" @click="editItem(item)" />
                            <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteItem(item)" />
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>
    <ConfirmModal v-if="store.getters['modals/activeModal'] === 'confirm-modal'" />
    <CreateTypeModal v-if="store.getters['modals/activeModal'] === 'create-type-modal'" />
</template>
<script setup>
import { onBeforeMount, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import CreateTypeModal from "@/components/systemSetup/CreateTypeModal.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'System Setup', disabled: true, href: 'breadcrumbs_link_1' },
    { title: 'Intel Primary Type', disabled: false, href: '' },
];

const headers = [
    { title: 'Id', key: 'ipt_id', class: 'text-center' },
    { title: 'Name', key: 'ipt_name', class: 'text-center' },
    { title: 'Description', key: 'ipt_desc', class: 'text-center' },
    { title: 'Created at', key: 'created_at', class: 'text-center' },
    { title: 'Actions', key: 'actions', sortable: false, class: 'text-center' },
];

const items = ref([

]);

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
        name: "create-type-modal",
        params: {
            title: "",
            action: "users/save",
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
        },
    });
}

const deleteItem = (item) => {
    store.dispatch("modals/open", {
        name: "confirm-modal",
        params: {
            title: "",
            message: "Are you sure you want to delete this Primary Type?",
            action: "users/save",
            toastMessage: "Primary Type has been deleted successfully.",
            actionParams: item,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        },
    });
}

onBeforeMount(async () => {
    store.dispatch("references/setHeaderTitle", "Information System Template");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>