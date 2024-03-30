<template>
    <n-spin :show="pageIsLoading">
        <h1 class="text-center">{{$t('signalR')}}</h1>
        <n-grid cols="12" responsive="screen">
            <n-grid-item span="6">
                <n-input-group>
                    <n-input :placeholder="$t('messageToSend')" v-model:value="messageToSend" />
                </n-input-group>
            </n-grid-item>
        </n-grid>
        <n-grid cols="12" responsive="screen">
            <n-grid-item span="12">
                <n-input-group>
                    <n-button type="info" strong v-on:click="sendMessageToBroadcast()">{{$t('sendMessageToBroadcast')}}</n-button>
                </n-input-group>
            </n-grid-item>
        </n-grid>
        <n-grid cols="12" responsive="screen">
            <n-grid-item span="6">
                <n-input-group>
                    <n-input :placeholder="$t('clientId')" v-model:value="selectedClientId" />
                </n-input-group>
            </n-grid-item>
            <n-grid-item span="6">
                <n-input-group>
                    <n-button type="info" strong v-on:click="sendMessageToClient()">{{$t('sendMessageToClient')}}</n-button>
                </n-input-group>
            </n-grid-item>
        </n-grid>
        <n-grid cols="12" responsive="screen">
            <n-grid-item span="6">
                <n-input-group>
                    <n-input :placeholder="$t('connectionId')" v-model:value="selectedConnectionId" />
                </n-input-group>
            </n-grid-item>
            <n-grid-item span="6">
                <n-input-group>
                    <n-button type="info" strong v-on:click="sendMessageToConnection()">{{$t('sendMessageToConnection')}}</n-button>
                </n-input-group>
            </n-grid-item>
        </n-grid>
        <n-grid cols="12" responsive="screen">
            <n-grid-item span="6">
                <n-input-group>
                    <n-input :placeholder="$t('userId')" v-model:value="selectedUserId" />
                </n-input-group>
            </n-grid-item>
            <n-grid-item span="6">
                <n-input-group>
                    <n-button type="info" strong v-on:click="sendMessageToUser()">{{$t('sendMessageToUser')}}</n-button>
                </n-input-group>
            </n-grid-item>
        </n-grid>
    </n-spin>
</template>

<style scoped lang="scss">
    @import "@/style/globalVariables.module.scss";
</style>
<script setup lang="ts">
    import { ref } from 'vue';
    import { Api } from '@/api/api';
    import { useMessage } from 'naive-ui';
    import { useI18n } from 'vue-i18n';

    var pageIsLoading = ref(false);

    const { t } = useI18n();
    const message = useMessage();

    //<send messages>
    var selectedConnectionId = ref('');
    var selectedClientId = ref('');
    var selectedUserId = ref('');
    var messageToSend = ref('');

    function sendMessageToBroadcast() {
        pageIsLoading.value = true;
        Api.sendMessageToBroadcast(messageToSend.value)
            .then((response: any) => {
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }

    function sendMessageToClient() {
        pageIsLoading.value = true;
        Api.sendMessageToClient(selectedClientId.value, messageToSend.value)
            .then((response: any) => {
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }

    function sendMessageToConnection() {
        pageIsLoading.value = true;
        Api.sendMessageToConnection(selectedConnectionId.value, messageToSend.value)
            .then((response: any) => {
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }

    function sendMessageToUser() {
        pageIsLoading.value = true;
        Api.sendMessageToUser(selectedUserId.value, messageToSend.value)
            .then((response: any) => {
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }
    //</send messages>
</script>