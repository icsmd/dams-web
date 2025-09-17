<template>
	<v-app-bar color="blue-grey-lighten-4">
		<div class="text-h6 pl-4 pr-3 text-uppercase">User Management</div>
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
				<v-card-text class="d-flex justify-space-between">
					<v-btn 
						prepend-icon="mdi mdi-plus"
						variant="elevated"
						color="green-darken-3"
						@click="create()"
					>
						Add User
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
                        :items="userList"
                        v-model="selected"
                        show-select
                        :item-value="'id'"
                        :items-per-page="itemsPerPage"
                        :page="page"
                        @update:page="page = $event"
                        :footer-props="{
                            'items-per-page-options': [5, 10, 20, 50],
                            'items-per-page-text': 'Rows per page:'
                        }"
                    >
                    </v-data-table>
				</v-card-text>
			</v-card>
		</v-container>
	</v-main>
	<CreateUserModal v-if="store.getters['modals/activeModal'] === 'create-user-modal'" />
</template>

<script setup>
import { onBeforeMount, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import CreateUserModal from "@/components/management/CreateUserModal.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'Admin Settings', disabled: true, href: 'breadcrumbs_link_1' },
    { title: 'User Management', disabled: false, href: '' },
];

const items = [
    { text: 'All', icon: 'fa fa-user' },
    { text: 'Active', icon: 'fa fa-user' },
    { text: 'Inactive', icon: 'fa fa-user' },
    { text: 'Pending', icon: 'fa fa-user' },
];

const search = ref('');
const selected = ref([]);
const userList = ref([]);

const headers = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email Address' },
];

const getList = async () => {
    try {
        const response = await axios.get("/get-list");
        userList.value = response.data.data;

        console.log(userList.value);
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

const create = () => {
    store.dispatch("modals/open", {
        name: "create-user-modal",
        params: {
            title: '',
            message: 'Are you sure you want to save this user account?',
            action: 'users/save',
            toastMessage: 'User has been created successfully.',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        },
    });
};

onMounted(() => {
	that.emitter.on("users/save", async () => {
		await getList();
	});
})

onBeforeMount(async () => {
    await getList();
    store.dispatch("references/setHeaderTitle", "Information System Template");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>