<template>
    <v-app-bar color="blue-grey-lighten-4">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Document Setup</div>
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
                <v-card-text>
                    <v-row class="align-center" no-gutters>
                        <v-col cols="12" md="auto" class="mb-2 mb-md-0">
                            <v-btn 
                                prepend-icon="mdi mdi-plus-circle" 
                                variant="elevated"
                                color="green-darken-3"
                                @click="create()"
                            >
                                Add Template
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
                        :item-value="'temp_id'"
                        :items-per-page="itemsPerPage"
                        :page="page"
                        @update:page="page = $event"
                        :footer-props="{
                            'items-per-page-options': [5, 10, 20, 50],
                            'items-per-page-text': 'Rows per page:'
                        }"
                    >
                        <template #item.actions="{ item }">
                            <template v-if="display.width.value > 1180">
                                <v-tooltip text="View">
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" icon="mdi-eye" variant="text" color="primary" @click="viewItem(item)" />
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="Edit">
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" icon="mdi-pencil" variant="text" color="orange" @click="editItem(item)" />
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="Delete">
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" icon="mdi-delete" variant="text" color="red" @click="deleteItem(item)" />
                                    </template>
                                </v-tooltip>
                            </template>
                            <template v-else>
                                <v-menu>
                                    <template #activator="{ props }">
                                        <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" color="primary" />
                                    </template>
                                    <v-list>
                                        <v-list-item @click="viewItem(item)">
                                            <v-list-item-title>
                                                <v-icon start icon="mdi-eye" color="primary" /> View
                                            </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="editItem(item)">
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
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>
    <ConfirmModal v-if="store.getters['modals/activeModal'] === 'confirm-modal'" />
</template>
<script setup>
import { onBeforeMount, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import ConfirmModal from "@/components/modals/ConfirmModal.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;
const display = useDisplay();

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'Document Management', disabled: true, href: 'breadcrumbs_link_1' },
    { title: 'Document Setup', disabled: false, href: '' },
];

const headers = [
    { title: 'Id', key: 'temp_id', class: 'text-center' },
    { title: 'Template Name', key: 'temp_name', class: 'text-center' },
    { title: 'Created By', key: 'created_by', class: 'text-center' },
    { title: 'Actions', key: 'actions', sortable: false, class: 'text-center' },
];

const items = ref([
    { temp_id: '0001', temp_name: 'Template Name 1', created_by: 'Juan Dela Cruz' },
    { temp_id: '0002', temp_name: 'Template Name 2', created_by: 'Juan Dela Cruz' },
    { temp_id: '0003', temp_name: 'Template Name 3', created_by: 'Juan Dela Cruz' },
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

const create = () => {
    router.push({ name: "document-management-settings-create" });
};

const deleteItem = (item) => {
    store.dispatch("modals/open", {
        name: "confirm-modal",
        params: {
            title: "",
            message: "Are you sure you want to delete this template?",
            action: "users/save",
            toastMessage: "Document template has been deleted successfully.",
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