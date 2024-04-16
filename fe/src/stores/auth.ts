import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            //username: () => {
            //    var username = localStorage.getItem("username");
            //    return username;
            //},
            //claims: () => {
            //    var claims = localStorage.getItem("claims");
            //    if (claims)
            //        return JSON.parse(claims);
            //    return [];
            //}
        }
    },
    getters: {
        /*i return di funzioni in getClaims e getUsername bypassano il bisogno
         di avere properties nello state. in questo caso va bene perché non c'è neanche
         bisogno di osservare lo state*/
        getClaims(state) {
            //return state.claims;
            return () => {
                var claims = localStorage.getItem("claims");
                if (claims)
                    return JSON.parse(claims);
                return [];
            }
        },
        getUsername(state) {
            //return state.username;
            return () => {
                return localStorage.getItem("username");
            }
        },
    },
    actions: {
        setClaims(claims: any) {
            localStorage.setItem("claims", JSON.stringify(claims));
        },
        removeClaims() {
            localStorage.removeItem("claims");
        },
        setUsername(username: string) {
            localStorage.setItem("username", username);
        },
        removeUsername() {
            localStorage.removeItem("username");
        }
    }
});