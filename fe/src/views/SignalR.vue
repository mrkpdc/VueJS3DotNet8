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
    import { onMounted, onBeforeUnmount, ref, h, watch } from 'vue';
    import { Auth } from '@/auth/auth';
    import { Api } from '@/api/api';
    import constantValues from '@/common/constantValues';
    import * as signalR from '@microsoft/signalr';

    //questo è per salvare il connectionId nel localstorage
    import { useSignalRStore } from '@/stores/signalr';

    var pageIsLoading = ref(false);

    const signalRStore = useSignalRStore();

    var initialSignalRConnectionInterval: number = 0;
    var signalRConnection = new signalR.HubConnectionBuilder()
        .withUrl(constantValues.backendUrl + "signalRHub"
            //, {
            //  httpClient: new CustomHTTPClient(new CustomLogger()),
            //  //  logMessageContent: true
            //}
        )
        .configureLogging(signalR.LogLevel.Information)
        //.withAutomaticReconnect([0, 2000, 10000, 10000, 10000, 10000, 10000, 10000, 30000, 30000, 30000])
        .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: context => {
                const retryTimes = [0, 2000, 10000, 10000, 10000, 10000, 10000, 10000, 30000, 30000, 30000];
                const index = context.previousRetryCount < retryTimes.length ? context.previousRetryCount : retryTimes.length - 1;
                //this.handleSignalRError(context.retryReason);
                //console.log(context);
                return retryTimes[index];
            }
        })
        .build();

    onMounted(() => {
        startSignalR();
    });

    /*onUnmounted non cancella l'interval, forse perché è troppo tardi,
    mentre questo ci riesce*/
    onBeforeUnmount(() => {
        signalRConnection.stop();
        clearInterval(initialSignalRConnectionInterval);
    });

    async function startSignalR() {
        console.log("startSignalR..");
        initialSignalRConnectionInterval = setInterval(
            async () => {
                if (signalRConnection.state === signalR.HubConnectionState.Disconnected) {
                    pageIsLoading.value = true;
                    console.log("trying initial connection..");
                    await signalRConnection.start().then(() => {
                        console.log("SignalR connected");

                        if (signalRStore.getCachedSignalRConnectionId() == '')
                            signalRStore.setCachedSignalRConnectionId(signalRConnection.connectionId);

                        signalRConnection.invoke("RegisterClientConnection", signalRStore.getCachedSignalRConnectionId())
                            .then(result => {
                                //console.log(result);
                                signalRStore.setCachedSignalRConnectionId(signalRConnection.connectionId);
                            });;

                        signalRConnection.onclose(async (error) => {
                            console.log("onclose", error);
                            handleSignalRError(error);
                        });

                        signalRConnection.onreconnecting((error) => {
                            //console.assert(this.signalRConnection.state === signalR.HubConnectionState.Reconnecting);
                            console.log("onreconnecting", error);
                            handleSignalRError(error);
                        });

                        signalRConnection.onreconnected(connectionId => {
                            console.log("new Connection ID:", connectionId);
                            signalRConnection.invoke("RegisterClientConnection", signalRStore.getCachedSignalRConnectionId())
                                .then(result => {
                                    //console.log(result);
                                    signalRStore.setCachedSignalRConnectionId(signalRConnection.connectionId);
                                });
                        });

                        signalRConnection.on("ReceiveMessage", async (data) => {
                            console.log("Received message from SignalR:", data);
                        });

                        pageIsLoading.value = false;
                    }).catch(error => {
                        console.log("start", error);
                        handleSignalRError(error);
                    });
                }
                else {
                    clearInterval(initialSignalRConnectionInterval);
                }
            }, 5000);
    }
    function handleSignalRError(error: Error | undefined) {
        if (error) {
            pageIsLoading.value = false;
            console.log(error);
            if (error.message.toLowerCase().includes("unauthorized")
                || error.message.includes("401")) {
                signalRConnection.stop();
                clearInterval(initialSignalRConnectionInterval);
                Auth.logout();
            };
        }
    }

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
                handleSignalRError(error);
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
                handleSignalRError(error);
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
                handleSignalRError(error);
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
                handleSignalRError(error);
            }).then(() => {
                pageIsLoading.value = false;
            });
    }
    //</send messages>
</script>