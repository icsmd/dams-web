<template>
    <v-app-bar color="blue-grey-lighten-4">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Create Template</div>
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
                <v-card-text class="px-0 pb-0">
                    <v-text-field
                        label="Template Name"
                        variant="outlined"
                        class="w-25"
                        v-model="templateName"
                    ></v-text-field>
                </v-card-text>
            </v-card>
            <div v-for="(section, idx) in sections" :key="section.id" class="mb-4">
                <v-card variant="outlined" class="position-relative">
                    <v-btn
                        icon="mdi mdi-close-circle"
                        color="red-darken-2"
                        variant="text"
                        v-if="sections.length > 1"
                        @click="removeSection(idx)"
                        class="position-absolute"
                        style="top: 8px; right: 8px; z-index: 2;"
                    ></v-btn>
                    <v-card-text class="pb-0">
                        <v-text-field
                            :label="`Section Name ${idx + 1}`"
                            variant="outlined"
                            class="w-25"
                            v-model="section.name"
                            :placeholder="'Section ' + (idx + 1)"
                        ></v-text-field>
                    </v-card-text>

                    <v-card-text v-if="section.fields.length" class="pt-0">
                        <div v-for="(field, fIdx) in section.fields" :key="field.id" class="mb-2">
                            <div class="d-flex align-center ga-2 justify-center flex-wrap">
                                <v-text-field
                                    label="Field Name"
                                    variant="outlined"
                                    v-model="field.name"
                                    class="w-25"
                                ></v-text-field>
                                <v-select
                                    label="Field Type"
                                    :items="fieldTypes"
                                    v-model="field.type"
                                    class="w-10"
                                    variant="outlined"
                                ></v-select>
                                <v-select
                                    label="Multiple Input"
                                    :items="fieldMultiple"
                                    v-model="field.multiple"
                                    class="w-10"
                                    variant="outlined"
                                ></v-select>
                                <v-btn
                                    icon="mdi mdi-delete"
                                    color="red-darken-2"
                                    variant="text"
                                    @click="removeInputField(idx, fIdx)"
                                ></v-btn>
                            </div>
                            
                            <!-- Only show options if field type is Select -->
                            <div v-if="field.type === 'Select'" class="mb-2 ml-8">
                                <div v-for="(option, oIdx) in field.options" :key="oIdx" class="d-flex align-center justify-end ga-2 mb-3 w-33">
                                    <v-text-field
                                        v-model="field.options[oIdx]"
                                        :label="`Option ${oIdx + 1}`"
                                        dense
                                        hide-details
                                        class="w-25"
                                        variant="outlined"
                                    ></v-text-field>
                                    <v-btn
                                        icon="mdi mdi-plus-circle"
                                        variant="text"
                                        color="light-blue-darken-4"
                                        @click="addSelectOption(idx, fIdx)"
                                    ></v-btn>
                                    <v-btn
                                        v-if="field.options.length > 1"
                                        icon="mdi mdi-delete"
                                        variant="text"
                                        color="red-darken-2"
                                        @click="removeSelectOption(idx, fIdx, oIdx)"
                                    ></v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card-text class="pt-0">
                    <div class="d-flex justify-end w-100 px-4 py-4 ga-2">
                        <v-btn
                            prepend-icon="mdi mdi-plus"
                            variant="flat"
                            color="light-blue-darken-4"
                            @click="addInputField(idx)"
                        >
                            Add Input Fields
                        </v-btn>
                    </div>
                </v-card>
            </div>
        </v-container>
        <!-- <v-container>
            <v-card>
                <v-card-title>JSON Output</v-card-title>
                <v-card-text>
                    <pre>{{ jsonOutput }}</pre>
                </v-card-text>
            </v-card>
        </v-container> -->
    </v-main>
    <v-footer app>
        <div class="d-flex justify-end w-100 ga-2">
            <v-btn
                prepend-icon="mdi mdi-plus"
                variant="flat"
                color="light-blue-darken-4"
                @click="addSection"
            >Add Section</v-btn>
            <v-btn
                prepend-icon="mdi mdi-close"
                variant="flat"
                color="red-darken-3"
                @click="clear"
            >Clear</v-btn>
            <v-btn
                prepend-icon="mdi mdi-check-circle"
                variant="flat"
                color="green-darken-4"
                @click="submitTemplate"
            >Submit</v-btn>
        </div>
    </v-footer>
    <ConfirmModal v-if="store.getters['modals/activeModal'] === 'confirm-modal'" />
</template>

<script setup>
import { onBeforeMount, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import ConfirmModal from "@/components/modals/ConfirmModal.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'Document Management', disabled: true, href: '' },
    { title: 'Document Setup', disabled: false, href: '/Document-Management/Settings' },
    { title: 'Create Template', disabled: false, href: '' },
];

const templateName = ref("");
const fieldTypes = ["Text", "Number", "Date", "Select", "Textarea"];
const fieldMultiple = ["Yes", "No"];

const sections = ref([
    {
        id: Date.now(),
        name: "",
        fields: []
    }
]);

function addSection() {
    sections.value.push({
        id: Date.now() + Math.random(),
        name: "",
        fields: []
    });
}

function removeSection(idx) {
    if (sections.value.length > 1) {
        sections.value.splice(idx, 1);
    }
}

function addInputField(sectionIdx) {
    sections.value[sectionIdx].fields.push({
        id: Date.now() + Math.random(),
        name: "",
        type: fieldTypes[0],
        options: [],
        multiple: fieldMultiple[1],
    });
}

function removeInputField(sectionIdx, fieldIdx) {
    sections.value[sectionIdx].fields.splice(fieldIdx, 1);
}

function ensureOptions(field) {
    if (field.type === "Select" && !field.options) {
        field.options = [""];
    }
    if (field.type !== "Select" && field.options) {
        delete field.options;
    }
}

function addSelectOption(sectionIdx, fieldIdx) {
    const field = sections.value[sectionIdx].fields[fieldIdx];
    if (!field.options) field.options = [];
    field.options.push("");
}

function removeSelectOption(sectionIdx, fieldIdx, optionIdx) {
    const field = sections.value[sectionIdx].fields[fieldIdx];
    if (field.options) field.options.splice(optionIdx, 1);
}

const submitTemplate = (values) => {
    const payload = {
        name: templateName.value,
        sections: sections.value.map(s => ({
            name: s.name,
            fields: s.fields.map(f => {
                const fieldData = {
                    name: f.name,
                    type: f.type,
                    multiple: f.multiple,
                };
                if (f.type === "Select") {
                    fieldData.options = f.options ? [...f.options] : [];
                }
                return fieldData;
            })
        }))
    };

    store.dispatch("modals/open", {
        name: "confirm-modal",
        params: {
            title: "",
            message: "Are you sure you want to save this document template?",
            action: "users/save",
            toastMessage: "Document template has been saved successfully.",
            actionParams: payload,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        },
    });
};

watch(
    sections,
    (newSections) => {
        newSections.forEach(section => {
            section.fields.forEach(field => {
                ensureOptions(field);
            });
        });
    },
    { deep: true }
);

onBeforeMount(async () => {
    store.dispatch("references/setHeaderTitle", "Information System Template");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>