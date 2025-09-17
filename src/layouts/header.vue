<template>
    <v-app>
        <v-app-bar app :elevation="2" color="blue-grey-darken-2">
            <!-- Hamburger menu for mobile -->
            <v-app-bar-nav-icon
                class="d-md-none"
                @click="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <template v-slot:prepend>
                <img src="/img/NICA.png" width=40 height=40 style="margin-left: 5px"></img>
            </template>
            <v-app-bar-title :backgroundColor="backgroundColor">
                Information System Template
            </v-app-bar-title>
            <template v-slot:append>
                <v-btn icon="mdi mdi-bell"></v-btn>
            </template>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            app
            color="blue-grey-darken-4"
            width="320"
            :permanent="$vuetify.display.mdAndUp"
            :temporary="!$vuetify.display.mdAndUp"
        >
            <template v-slot:prepend>
            <v-list-item
                lines="two"
                prepend-avatar="/img/user.jpg"
                subtitle="201810082"
                title="Juan Dela Cruz"
            ></v-list-item>
            </template>

            <v-divider></v-divider>
            <v-list nav density="compact">
                <template v-for="item in menuItems" :key="item.title">
                    <v-list-group
                        v-if="Array.isArray(item.children)"
                        :prepend-icon="item.icon"
                        :title="item.title"
                    >
                        <template #activator="{ props }">
                            <v-list-item v-bind="props" :title="item.title" :prepend-icon="item.icon" />
                        </template>
                        <v-list-item
                            v-for="child in item.children"
                            :key="child.title"
                            :to="{ name: child.routeName }"
                            link
                            :title="child.title"
                            :prepend-icon="child.icon"
                            class="no-indent"
                        />
                    </v-list-group>
                    <v-list-item
                        v-else
                        :to="{ name: item.routeName }"
                        link
                        :title="item.title"
                        :prepend-icon="item.icon"
                    />
                </template>
            </v-list>
            <template v-slot:append>
                <div 
                    class="pa-2"
                >
                    <v-btn 
                        prepend-icon="mdi mdi-logout-variant"
                        :disabled="loading"
                        :loading="loading"
                        color="red-darken-2"
                        variant="flat"
                        block 
                        @click="logout"
                    >
                    Logout
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-main class="main-scroll">
            <RouterView />
        </v-main>
    </v-app>
</template>
<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const store = useStore();
const router = useRouter();
const drawer = ref(true);
const display = useDisplay();

const menuItems = [
    { title: "User Manual", icon: "mdi-information", routeName: "not-found" },
    { title: "Dashboard", icon: "mdi mdi-view-dashboard", routeName: "main-menu" },
    {
        title: "Document Management",
        icon: "mdi-folder",
        children: [
            { title: "Document List", icon: "mdi mdi-file-document-multiple", routeName: "document-management" },
            { title: "Document Setup", icon: "mdi mdi-cog", routeName: "document-management-settings" }
        ]
    },
        {
        title: "System Setup",
        icon: "mdi mdi-cogs",
        children: [
            { title: "Intel Primary Type", icon: "mdi mdi-cog", routeName: "intel-primary-type" },
            { title: "Intel Secondary Type", icon: "mdi mdi-cog", routeName: "not-found" }
        ]
    },
    {
        title: "Account Management",
        icon: "mdi mdi-account-circle",
        children: [
            { title: "User Management", icon: "mdi mdi-account-group", routeName: "user-management" },
            { title: "Position", icon: "mdi mdi-badge-account", routeName: "not-found" },
            { title: "Roles and Access", icon: "mdi mdi-shield-account", routeName: "not-found" },
            { title: "Audit Trail", icon: "mdi-history", routeName: "not-found" },
        ]
    },
];

const headerTitle = computed(() => store.getters['references/headerTitle']);
const route = computed(() => store.getters['references/route']);
const backgroundColor = computed(() => store.getters['references/backgroundColor']);

const logout = () => {
    router.push({ name: 'Login' });
}
</script>

<style scoped>
.no-indent {
  padding-left: 8px !important; /* Match main menu item padding */
}

.main-scroll {
  height: 100vh;
  overflow-y: auto;
  /* Optional: Prevent horizontal scroll */
  overflow-x: hidden;
}
</style>