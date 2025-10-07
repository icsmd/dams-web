<template>
    <v-app>
        <v-app-bar app :elevation="2" color="brown-darken-2">
            <!-- Hamburger menu for mobile -->
            <v-app-bar-nav-icon
                class="d-md-none"
                @click="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <template v-slot:prepend>
                <img src="/img/NICA.png" width=40 height=40 style="margin-left: 5px"></img>
            </template>
            <v-app-bar-title :backgroundColor="backgroundColor">
                ELECTRONIC ATTENDANCE MANAGEMENT SYSTEM
            </v-app-bar-title>
            <template v-slot:append>
                <v-btn icon="mdi mdi-bell"></v-btn>
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn v-bind="props" icon>
                            <v-avatar size="32">
                                <img
                                    src="/public/img/user.jpg"
                                    alt="User"
                                    style="width: 100%; height: 100%; object-fit: cover;"
                                />
                            </v-avatar>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item title="View Profile" class="custom-list-item-gap" prepend-icon="mdi mdi-account" @click="openProfile"></v-list-item>
                        <v-list-item title="Logout" class="custom-list-item-gap" prepend-icon="mdi mdi-logout-variant" @click="logout"></v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            app
            color="brown-darken-4"
            width="320"
            :permanent="$vuetify.display.mdAndUp"
            :temporary="!$vuetify.display.mdAndUp"
        >
            <template v-slot:prepend>
            <v-list-item
                lines="two"
                prepend-avatar="/img/user.jpg"
                :subtitle="model.userPid"
                :title="model.userFirstName + ' ' + model.userLastName"
            ></v-list-item>
            </template>

            <v-divider></v-divider>
            <v-list nav density="compact">
                <template v-for="item in menuItems" :key="item.title">
                    <v-list-group
                        v-if="Array.isArray(item.children)"
                        :prepend-icon="item.icon"
                        :title="item.title"
                        class="h-4"
                    >
                        <template #activator="{ props }">
                            <v-list-item v-bind="props" :title="item.title" :prepend-icon="item.icon" class="text-h6" />
                        </template>
                        <v-list-item
                            v-for="child in item.children"
                            :key="child.title"
                            :to="{ name: child.routeName }"
                            link
                            :title="child.title"
                            :prepend-icon="child.icon"
                            class="no-indent text-h6"
                        />
                    </v-list-group>
                    <v-list-item
                        v-else
                        :to="{ name: item.routeName }"
                        link
                        :title="item.title"
                        :prepend-icon="item.icon"
                        class="text-h6"
                    />
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-main class="main-scroll">
            <RouterView />
        </v-main>
    </v-app>
</template>
<script setup>
import { useStore } from "vuex";
import { computed, ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import pako from "pako";

const store = useStore();
const router = useRouter();
const drawer = ref(true);
const display = useDisplay();
const headerTitle = computed(() => store.getters['references/headerTitle']);
const route = computed(() => store.getters['references/route']);
const backgroundColor = computed(() => store.getters['references/backgroundColor']);

const model = reactive({
    userDetails: null,
    userFirstName: null,
    userLastName: null,
    userPid: null,
    tokenDetails: null
});

const menuItems = [
    { title: "User Manual", icon: "mdi-information", routeName: "not-found" },
    { title: "Dashboard", icon: "mdi mdi-view-dashboard", routeName: "main-menu" },
    { title: "ManCom", icon: "mdi mdi-account-group", routeName: "Man-com" },
    { title: "NIC", icon: "mdi mdi-account-group", routeName: "Nic" },
    {
        title: "System Setup",
        icon: "mdi mdi-cogs",
        children: [
            { title: "Person", icon: "mdi mdi-account-box", routeName: "system-person" },
            { title: "Designation", icon: "mdi mdi-badge-account", routeName: "system-designation" },
            { title: "Agency", icon: "mdi mdi-office-building", routeName: "system-agency" },
        ]
    },
];

const logout = async() => {
    try {
        let tokenId = model.tokenDetails.token_id;
        let accessToken = model.tokenDetails.token;
        let response = await axios.put("http://ciamis.infosys.local:8001/api/v1/auth/unauthenticate/" + tokenId, {}, 
            {
                headers: {
                Authorization: `Bearer ${accessToken}`
                }
            }
        );
        document.cookie = `session_user=; Max-Age=0; path=/;`;
        document.cookie = `session_token=; Max-Age=0; path=/;`;

        router.push({ name: 'Login' });
    } catch (error) {
        let customErrMsg = error.response.data.message;
        Toast.fire({
            icon: "error",
            title: customErrMsg,
        });
    };
}

const openProfile = () => {
    router.push({ name: 'profile' });
}

const getUserSession = () => {
    model.userDetails = decompressPayload(getCookie('session_user'));
    model.tokenDetails = decompressPayload(getCookie('session_token'));
    model.userFirstName = model.userDetails.first_name;
    model.userLastName = model.userDetails.last_name;
    model.userPid = model.userDetails.pid;
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

onBeforeMount(async () => {
    await getUserSession();
});
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

::v-deep(.custom-list-item-gap .v-list-item__prepend),
::v-deep(.custom-list-item-gap .v-list-item__content) {
  margin: 0 !important;
  padding: 0 !important;
}

::v-deep(.custom-list-item-gap .v-list-item-title) {
  font-size: 14px !important;
}

.my-custom-title .v-list-item__title {
  font-size: 2rem; /* or any specific size you want */
  font-weight: bold;
}
</style>