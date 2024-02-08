import { defineStore } from 'pinia';

export const useSignalRStore = defineStore('signalr', {
    state: () => {
        return {}
    },
    getters: {
        getCachedSignalRConnectionId(state) {
            return () => {
                return localStorage.getItem("CSRC");
            }
        },
    },
    actions: {
        setCachedSignalRConnectionId(connectionId: any) {
            localStorage.setItem("CSRC", connectionId);
        }
    }
});