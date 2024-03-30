import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
    state: () => {
        return {
            hasNotifications: false
        }
    },
    getters: {
        getHasNotifications(state) {
            return () => {
                return state.hasNotifications;
            }
        },
    },
    actions: {
        setHasNotifications(hasNotifications: any) {
            this.hasNotifications = hasNotifications;
        }
    }
});