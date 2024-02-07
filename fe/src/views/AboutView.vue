<template>
    <div>
        <h1 class="scssTest">This is an about page</h1>
        <n-button type="primary">
            Primary
        </n-button>

        <n-date-picker v-model:value="timestamp" type="date" />
        <pre>{{ JSON.stringify(timestamp) }}</pre>
        about: {{ $t('hi') }}
    </div>
</template>

<style scoped lang="scss">
    @import "@/style/globalVariables.module.scss";

    .scssTest {
        color: $primaryColor;
    }
</style>
<script setup lang="ts">
    import { ref } from 'vue';
    //import { useTestStore } from '@/stores/test';
    const timestamp = ref(1183135260000);

    //const store = useTestStore();
    //store.count
</script>