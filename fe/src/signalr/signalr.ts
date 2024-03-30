import * as signalR from '@microsoft/signalr';
import { Auth } from '@/auth/auth';
import { useAuthStore } from '@/stores/auth';
import constantValues from '@/common/constantValues';
//questo è per salvare il connectionId nel localstorage
import { useSignalRStore } from '@/stores/signalr';
import { useNotificationsStore } from '@/stores/notifications';

export class SignalR {
    private static initialSignalRConnectionInterval: number = 0;
    private static signalRConnection: any = null;
    private static authStore: any = null;
    private static signalRStore: any = null;
    private static notificationsStore: any = null;

    static startSignalR() {
        this.authStore = useAuthStore();
        this.signalRStore = useSignalRStore();
        this.notificationsStore = useNotificationsStore();
        if (!this.signalRConnection) {
            this.buildSignalRConnection();
        }
        else
            this.connectSignalR();
    }

    private static buildSignalRConnection() {
        if (!this.signalRConnection) {
            this.signalRConnection = new signalR.HubConnectionBuilder()
                .withUrl(constantValues.backendUrl + "signalRHub"
                    , { accessTokenFactory: () => this.authStore.getJWTToken() as string }
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

            this.signalRConnection.onclose(async (error: any) => {
                console.log("onclose", error);
                this.handleSignalRError(error);
            });

            this.signalRConnection.onreconnecting((error: any) => {
                //console.assert(this.signalRConnection.state === signalR.HubConnectionState.Reconnecting);
                console.log("onreconnecting", error);
                this.handleSignalRError(error);
            });

            this.signalRConnection.onreconnected((connectionId: any) => {
                console.log("new Connection ID:", connectionId);
                this.signalRConnection.invoke("RegisterClientConnection", this.signalRStore.getCachedSignalRConnectionId())
                    .then((result: any) => {
                        //console.log(result);
                        this.signalRStore.setCachedSignalRConnectionId(this.signalRConnection.connectionId);
                    });
            });

            this.signalRConnection.on("ReceiveMessage", async (data: any) => {
                console.log("Received message from SignalR:", data);
                this.notificationsStore.setHasNotifications(true);
            });
        }
        if (this.signalRConnection)
            this.connectSignalR();
    }

    private static connectSignalR() {
        let signalRConnectionFunction = async () => {
            console.log("new instance !");
            if (this.signalRConnection.state === signalR.HubConnectionState.Disconnected) {
                console.log("trying initial connection..");
                await this.signalRConnection.start().then(() => {
                    console.log("SignalR connected");

                    if (this.signalRStore.getCachedSignalRConnectionId() == '')
                        this.signalRStore.setCachedSignalRConnectionId(this.signalRConnection.connectionId);

                    this.signalRConnection.invoke("RegisterClientConnection", this.signalRStore.getCachedSignalRConnectionId())
                        .then((result: any) => {
                            //console.log(result);
                            this.signalRStore.setCachedSignalRConnectionId(this.signalRConnection.connectionId);
                        });
                }).catch((error: any) => {
                    console.log("start", error);
                    this.handleSignalRError(error);
                });
            }
            else {
                console.log("clear interval !");
                clearInterval(this.initialSignalRConnectionInterval);
            }
        };
        signalRConnectionFunction();
        if (!this.signalRConnection)
            this.initialSignalRConnectionInterval = setInterval(signalRConnectionFunction, 5000);
    }

    private static handleSignalRError(error: Error | undefined) {
        if (error) {
            console.log(error);
            if (error.message.toLowerCase().includes("unauthorized")
                || error.message.includes("401")) {
                //console.log("signalr error !");

                const refreshToken = useAuthStore().getJWTRefreshToken();
                if (refreshToken) {
                    let refreshingToken = true;
                    let errorRefreshingToken = false;

                    Auth.refreshTokens(refreshToken).then((response: any) => {
                        var claims = response.data.claims;
                        var jwtToken = response.data.token;
                        var jwtRefreshToken = response.data.refreshToken;

                        useAuthStore().setClaims(claims);
                        useAuthStore().setJWTToken(jwtToken);
                        useAuthStore().setJWTRefreshToken(jwtRefreshToken);
                        refreshingToken = false;
                        //console.log("repeating request:", error);
                    }).catch((error: any) => {
                        errorRefreshingToken = true;
                        //console.log("error refreshing tokens !", error);
                    });
                }
                else {
                    this.stopSignalR();
                    clearInterval(this.initialSignalRConnectionInterval);
                    Auth.logout();
                }
            }
        }
    }

    static stopSignalR() {
        if (this.signalRConnection) {
            this.signalRConnection.stop();
        }
        clearInterval(this.initialSignalRConnectionInterval);
    }
}