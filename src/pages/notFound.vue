<template>
    <v-empty-state
        headline="Whoops, Ongoing Development!"
        text="This page is under development"
        image="/img/NICA.png">
    </v-empty-state>
</template>
<script setup>
import { onBeforeMount, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

onBeforeMount(() => {
	store.dispatch("references/setHeaderTitle", "Information System Template");
	store.dispatch("references/setBackgroundColor", "bg-[#CD84F1]");
});
</script>