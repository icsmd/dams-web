<template>
    <v-container fluid class="bg-container">
        <div class="bg-image"></div>
        <v-row align="center" justify="left">
            <v-card width="600" class="rounded-lg d-flex flex-column align-center pa-6 main-card" max-width="650">
                <v-card-title class="text-h6 text-md-h5 text-lg-h4 text-center text-wrap custom-line-height">
                    ELECTRONIC ATTENDANCE MANAGEMENT SYSTEM
                </v-card-title>
                
                <v-card-subtitle class="text-center" style="margin-bottom: 10px;">
                    <p>Welcome!</p>
                    <p>Please login to your account</p>
                </v-card-subtitle>

                <form @submit.prevent="login()" class="w-100">
                    <v-text-field
                        label="Username"
                        prepend-inner-icon="mdi mdi-account"
                        variant="outlined"
                        type="text"
                        class="w-100"
                        v-model="model.email"
                    ></v-text-field>
                    
                    <v-text-field
                        label="Password"
                        prepend-inner-icon="mdi mdi-lock"
                        variant="outlined"
                        type="password"
                        class="w-100"
                        v-model="model.password"
                    ></v-text-field>
                    
                    <div class="text-end w-100 mb-2">
                        <span class="cursor-pointer forgot-text" @click="forgotPassword()">Forgot Password ?</span>
                    </div>

                    <v-card-actions class="justify-center">
                        <v-btn
                            :disabled="model.isLoading == true"
                            :loading="model.isLoading == true"
                            class="text-none mb-4"
                            color="indigo-darken-3"
                            size="x-large"
                            variant="flat"
                            width="550"
                            type="submit" 
                        >
                            Login
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import pako from "pako"

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;

const model = reactive({
  isLoading: false,
  email: null,
  password: null,
});

const forgotPassword = () => {
    model.isLoading = true;

    Toast.fire({
        icon: "info",
        title: "Please contact your administrator for password reset inquiry.",
    });

    model.isLoading = false;
}

const login = async () => {
    model.isLoading = true;

    try {
        let response = await axios.post("http://ciamis.infosys.local:8001/api/v1/auth/authenticate", {
            username: btoa(model.email),
            password: btoa(model.password),
        });
        let result = response.data.data;
        let tokenDetails = decompressPayload(result.token_details);
        let expiryTime = tokenDetails.expires_at;
        setCookie('session_user', result.user_details, expiryTime);
        setCookie('session_token', result.token_details, expiryTime);
        let firstName = decompressPayload(result.user_details).first_name;

        axios.get("/");
        router.push({
            name: "main-menu",
        });

        Toast.fire({
            icon: "success",
            title: "Welcome " + firstName + "!",
        });
    } catch (error) {
        Toast.fire({
            icon: "danger",
            title: "Incorrect Credential",
        });
    };

    model.isLoading = false;
}

const decompressPayload = (base64String) => {
  let binary = atob(base64String);
  let bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  let json = pako.inflate(bytes, { to: "string" });

  return JSON.parse(json);
}

const setCookie = (name, value, expiryDateTimeString) => {
  let date = new Date(expiryDateTimeString.replace(" ", "T"));
  let expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
</script>

<style scoped>
.bg-container {
    background-color: #f4f6f7;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.bg-image {
    position: absolute;
    right: -30vw;
    top: 0;
    height: 100vh;
    width: 75vw;
    background-image: url("/img/NICA.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.5;
    transition: all 0.3s;
    z-index: 1;
}

.v-row {
    height: 100vh !important;
    width: 100vw !important;
    position: relative;
    z-index: 2;
    margin-left: 5% !important;
    margin: 0;
}

.main-card {
    z-index: 3;
    background: rgba(255,255,255,0.95);
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

@media (max-width: 1124px) {
    .bg-image {
        left: 0;
        right: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-position: center center;
        opacity: 0.3;
    }
    .v-row {
        width: 96vw !important;
        height: 100vh !important;
        justify-content: center !important;
        align-items: center !important;
        margin: 0 !important;
    }
    .main-card {
        width: 80vw !important;
        max-width: 80vw !important;
        min-width: 0 !important;
        padding: 2rem !important;
        margin: 0 !important;
    }
}

@media (max-width: 768px) {
    .v-row {
        width: 94vw !important;
    }

    .v-btn {
        width: 70vw !important;
    }
}

.v-card-title {
    font-weight: 700;
    color: #0E4572;
}

.forgot-text {
    font-size: 14px;
    font-weight: 600;
    color: #0E4572;
}

.custom-line-height {
    line-height: 1; /* Adjust as needed, e.g., 1.2, 2, or 32px */
}
</style>