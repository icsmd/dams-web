<template>
    <v-app-bar color="brown-lighten-2">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Attendance Dashboard</div>
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
    <v-main class="pa-5" width="100%" height="100%">
        <v-container>
            <v-card flat>
                <v-card-text>
                    <v-row class="align-center" no-gutters>
                        <v-col cols="12" md="auto" class="mb-2 mb-md-0">
                            <v-btn 
                                prepend-icon="mdi mdi-account-check" 
                                variant="elevated"
                                color="light-green-darken-4"
                                class="mr-2"
                                @click="addAttendee()"
                            >
                                Enter Attendees
                            </v-btn>
                            <v-btn 
                                prepend-icon="mdi mdi-printer" 
                                variant="elevated"
                                color="light-blue-darken-4"
                                @click="print()"
                            >
                                Print Attendance
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
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>

    <AddAttendeesModal v-if="store.getters['modals/activeModal'] === 'add-attendees-modal'" />
    <iframe ref="printFrame" class="d-none"></iframe>
</template>
<script setup>
import { onBeforeMount, ref, onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import pako from "pako";

import AddAttendeesModal from "@/components/mancom/attendance/AddAttendeesModal.vue";

const printFrame = ref(null);

const store = useStore();
const router = useRouter();
const route = useRoute();
const that = self;
const display = useDisplay();
const items = ref([]);

const search = ref("");
const selected = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);

const model = reactive({
    userDetails: null,
    userPid: null,
    tokenDetails: null,
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

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'Management Committee', disabled: true, href: 'breadcrumbs_link_1' },
    { title: 'Meeting Dashboard', disabled: false, href: `/Management-Committee/Meetings` },
    { title: 'Event Dashboard', disabled: false, href: `/Management-Committee/Meetings/${route.params.id}/Events` },
];

const headers = [
    { title: 'Attendee No', key: 'sys_id', class: 'text-center' },
    { title: 'Name', key: 'fullname', class: 'text-center' },
    { title: 'Sex', key: 'person_details.sex', class: 'text-center' },
    { title: 'Agency', key: 'person_details.agency_details.abbr', class: 'text-center' },
    { title: 'Created At', key: 'created_at', sortable: false, class: 'text-center' },
];

const filteredItems = computed(() => {
    if (!search.value) return items.value;
    return items.value.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(search.value.toLowerCase())
        )
    );
});

const addAttendee = () => {
    store.dispatch("modals/open", {
        name: "add-attendees-modal",
        params: {
            title: "add attendees",
            action: "attendance/save",
            actionManual: "person/save",
            confirmButtonText: "Add",
            cancelButtonText: "Cancel",
            meeting_id: route.params.id,
            event_id: route.params.eventId,
            user: getFullNameInitial(model.userDetails),
        },
    });
}

const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}${minutes}H`;
};

const formatDateWithDay = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        weekday: 'long' // This option adds the day of the week
    };

    // toLocaleDateString returns a string like "Tuesday, September 02, 2025"
    // We need to re-arrange the parts to get the desired output
    const formattedDate = date.toLocaleDateString('en-US', options);

    // Now, split the string and re-arrange it
    const parts = formattedDate.split(', ');
    const dayName = parts[0]; // "Tuesday"
    const datePart = parts[1]; // "September 02"
    const yearPart = parts[2]; // "2025"

    // Construct the final string in the desired format
    return `${datePart} ${yearPart} (${dayName})`;
};

const print = () => {
    const content = generatePrintHTML();
    const frame = printFrame.value;
    if (frame) {
        const printDocument = frame.contentWindow.document;
        printDocument.open();
        printDocument.write(content);
        printDocument.close();
        frame.contentWindow.print();
    } else {
        alert("Please allow pop-ups for this website to print.");
    }
}

const generatePrintHTML = () => {
    const firstItem = items.value[0];
    const time = firstItem ? formatTime(firstItem.event_details.time) : '';

    let commandGroup = ``;

    items.value.forEach((item, index) => {
        commandGroup += `
            <tr>
                <td style="text-align: center;">COMMAND GROUP</td>

            </tr>
        `;
    });

    return `
        <html>
            <head>
                <title>Attendance List</title>
                <style>
                    @page {
                        size: A4;
                    }
                    body {
                        font-family: 'Poppins', sans-serif !important;
                        box-sizing: border-box;
                    }
                    table {
                        border-collapse: collapse; 
                        width: 100%;
                        margin-top: 20px;
                    }
                    td {
                        border: 1px solid #000; 
                        padding: 8px; 
                    }
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body style="width: 97%;">
                <div style="display: flex; flex-direction: column; align-item: center; justify-content: center; margin: 0; padding: 0;">
                    <div style="text-align: center; color: #0070c0; font-weight: bold; font-size: 24px;">
                        CONFIDENTIAL
                    </div>
                    <div style="text-align: center; color: white; font-weight: bold; font-size: 20px; background-color: #0070c0; padding: 5px 0; width: 100%; margin-bottom: 5px; margin-top: 5px;">
                        ATTENDANCE
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 18px; line-height: 1;">
                        Republic of the Philippines
                    </div>
                    <div style="text-align: center; font-size: 18px; line-height: 1;">
                        Office of the President
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 18px; line-height: 1;">
                        National Intelligence Coordinating Agency
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 18px; line-height: 1;">
                        MANAGEMENT COMMITTEE MEETING
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 18px; margin-top: 3px; margin-bottom: 3px;">
                        ${items.value[0]?.event_details?.title || ''}
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 18px; margin-top: 3px; margin-bottom: 3px;">
                        ${formatDateWithDay(items.value[0]?.event_details.date)} - ${time}
                    </div>
                    <div style="text-align: center; font-size: 18px; line-height: 1;">
                        ${items.value[0]?.event_details?.venue || ''}
                    </div>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <td style="text-align: center">COMMAND GROUP</td>
                            <td>
                                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                    <div style="width: 100%; border-bottom: 1px solid black; margin-bottom: 5px;"></div>
                                    <div style="font-weight: normal; font-size: 16px; text-transform: uppercase;">Director General</div>
                                    <div style="font-weight: bold; font-size: 16px;">
                                    </div>
                                <div>
                            </td>
                            <td>command group</td>
                            <td>command group</td>
                            <td>command group</td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `
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

const getFullNameInitial = (user) => {
    const { prefix, first_name, middle_name, last_name, suffix } = user;
    
    const nameParts = [];

    if (prefix) {
        nameParts.push(prefix);
    }

    if (first_name) {
        nameParts.push(first_name);
    }

    if (middle_name && middle_name.trim().length > 0) {
        nameParts.push(middle_name.trim().charAt(0) + '.');
    }

    if (last_name) {
        nameParts.push(last_name);
    }

    if (suffix) {
        nameParts.push(suffix);
    }

    return nameParts.join(' ').trim();
};

const getUserSession = () => {
    model.userDetails = decompressPayload(getCookie('session_user'));
    model.tokenDetails = decompressPayload(getCookie('session_token'));
}

const getList = async () => {
    try {
        const response = await axios.get("v1/attendance");
        items.value = response.data.data.filter(item => item.event_details.id == route.params.eventId);
    } catch (error) {
        console.error("Error fetching list:", error);
    }
};

onMounted(() => {
    that.emitter.on("attendance/save", async () => {
        await getList();
    });

    that.emitter.on("attendance/update", async () => {
        await getList();
    });

    that.emitter.on("destroy", async () => {
        await getList();
    });
})

onBeforeMount(async () => {
    await getList();
    await getUserSession();
    
    store.dispatch("references/setHeaderTitle", "Information System Template");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>