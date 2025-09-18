<template>
    <v-app-bar color="brown-lighten-2">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Designation</div>
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
                            >
                                Add Designation
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

                        <template #item.actions="{ item }">
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
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>
</template>
<script setup>
import { onBeforeMount, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;
const display = useDisplay();
const items = ref([]);

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'System Setup', disabled: true, href: 'breadcrumbs_link_1' },
    { title: 'Designation', disabled: false, href: '' },
];

const headers = [
    { title: 'Designation No.', key: 'sys_id', class: 'text-center' },
    { title: 'Designation', key: 'designation', class: 'text-center' },
    { title: 'Office', key: 'office', class: 'text-center' },
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

const getList = async () => {
    try {
        const response = await axios.get("v1/person_desig");
        items.value = response.data.data.filter(item => item.status === 'active');

        console.log(items.value);
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

onBeforeMount(async () => {
    await getList();
    
    store.dispatch("references/setHeaderTitle", "Digital Attendance Monitoring System");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>