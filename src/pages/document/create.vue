<template>
    <v-app-bar color="blue-grey-lighten-4">
        <div class="text-h6 pl-4 pr-3 text-uppercase">Create Document</div>
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
                    <div class="d-flex align-center ga-4">
                        <v-combobox
                            clearable
                            label="Document Template"
                            :items="templates"
                            v-model="template"
                            variant="outlined"
                            style="min-width: 250px; max-width: 450px;"
                        ></v-combobox>
                        <v-btn
                            prepend-icon="mdi mdi-magnify"
                            variant="flat"
                            color="light-blue-darken-4"
                            @click="addInputField(idx)"
                        >
                            search
                        </v-btn>
                    </div>              
                </v-card-text>
            </v-card>
            <v-stepper v-model="step" non-linear>
                <v-stepper-header>
                    <template v-for="(section, idx) in forms[0].sections" :key="idx">
                        <v-stepper-item
                            :title="section.name"
                            :value="idx + 1"
                        />
                        <v-divider
                            v-if="idx < forms[0].sections.length - 1"
                            class="mx-2"
                        horizontal
                        :key="'divider-' + idx"
                        style="height: 32px; align-self: center;"
                        />
                    </template>
                </v-stepper-header>
                <v-stepper-window>
                    <v-stepper-window-item
                        v-for="(section, idx) in forms[0].sections"
                        :key="idx"
                        :value="idx + 1"
                    >
                    <v-row class="mb-2 mt-2" dense>
                        <v-col
                            v-for="(field, fIdx) in section.fields"
                            :key="fIdx"
                            cols="12"
                            md="3"
                        >
                            <v-text-field
                                v-if="field.type === 'Text'"
                                :label="field.name"
                                variant="outlined"
                            />
                            <v-select
                                v-else-if="field.type === 'Select'"
                                :label="field.name"
                                :items="field.options"
                                variant="outlined"
                            />
                        </v-col>
                    </v-row>
                    <div class="d-flex justify-space-between mt-4 w-100">
                        <v-btn
                            :disabled="idx === 0"
                            @click="step = idx"
                            class="mr-2"
                            variant="outlined"
                        >Back</v-btn>
                        <v-btn
                            :disabled="idx === forms[0].sections.length - 1"
                            @click="step = idx + 2"
                            color="light-blue-darken-4"
                            variant="flat"
                        >Next</v-btn>
                    </div>
                    </v-stepper-window-item>
                </v-stepper-window>
            </v-stepper>
        </v-container>
    </v-main>
</template>
<script setup>
import { onBeforeMount, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();
const step = ref(0);

const getBreadcrumbs = [
    { title: 'Home', disabled: false, href: '/Main-Menu' },
    { title: 'Document Management', disabled: true, href: '' },
    { title: 'Document List', disabled: false, href: '/Document-Management/' },
    { title: 'Create Document', disabled: false, href: '' },
];

const template = ref("");
const templates = ["template A", "template B", "template C"];

onBeforeMount(async () => {
    store.dispatch("references/setHeaderTitle", "Information System Template");
    store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});

const forms = ref([
  {
    name: "qweqe",
    sections: [
        {
            "name": "qweqwewq",
            "fields": [
                {
                    "name": "qweqwe",
                    "type": "Text",
                    "multiple": "Yes"
                },
                {
                    "name": "qweqweqw",
                    "type": "Select",
                    "multiple": "No",
                    "options": [
                        "test 1",
                        "test 2"
                    ]
                }
            ]
        },
        {
            "name": "test 2",
            "fields": [
                {
                    "name": "qweqwe",
                    "type": "Text",
                    "multiple": "Yes"
                },
                {
                    "name": "qweqweqw",
                    "type": "Select",
                    "multiple": "No",
                    "options": [
                        "test 1",
                        "test 2"
                    ]
                }
            ]
        }
    ]
  }
]);

</script>