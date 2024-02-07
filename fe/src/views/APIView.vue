<template>
    <div>
        <h1 class="scssTest">This is an API page</h1>
        <button v-on:click="getData()">get data</button>
        <button v-on:click="getDataAuth()">get data AUTH ONLY</button>
        <div v-for="item in items">
            {{item}}
        </div>
        <div v-for="item in itemsAuth">
            {{item}}
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "@/style/globalVariables.module.scss";

    .scssTest {
        color: $primaryColor;
    }
</style>
<script setup lang="ts">
    import { inject, onMounted, ref, watch } from 'vue';
    const axios: any = inject('axios');
    var items = ref([]);
    var itemsAuth = ref([]);
    onMounted(() => {
        getData();
    });
    function getData() {
        axios.get('Values/GetItems')
            .then((response: { data: any }) => {
                items.value = response.data.result;
            });
    }
    function getDataAuth() {
        axios.get('Values/GetItemsAuth')
            .then((response: { data: any }) => {
                itemsAuth.value = response.data.result;
            });
    }
    watch(items, (newValue, oldValue) => {
        console.log(items);
        console.log(oldValue);
        console.log(newValue);
    });
</script>