import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router/router';

export class Auth {
    static login(username: string, password: string, callback?: any) {
        var body = {
            username: username,
            password: password
        };
        axios.post("Auth/Login", body).then((response: any) => {
            var claims = response.data.claims;
            var jwtToken = response.data.token;
            var jwtRefreshToken = response.data.refreshToken;
            useAuthStore().setClaims(claims);
            useAuthStore().setUsername(username);
            useAuthStore().setJWTToken(jwtToken);
            useAuthStore().setJWTRefreshToken(jwtRefreshToken);
            //router.push('/api');
        })
            .catch((error: any) => {
            }).then(() => {
                if (callback)
                    callback();
            });
    }
    static refreshTokens(refreshToken: string) {
        let body = {
            refreshToken: refreshToken
        }
        return axios.post("Auth/RefreshTokens", body);
    }
    static logout() {
        useAuthStore().removeClaims();
        useAuthStore().removeUsername();
        useAuthStore().removeJWTToken();
        useAuthStore().removeJWTRefreshToken();
        router.push('/');
    }
    static checkClaim(claimType: string, claimValue?: string) {
        var value = claimValue ? claimValue : 'True';
        var claims = useAuthStore().getClaims();
        var result = false;
        if (claims)
            for (var i = 0; i < claims.length; i++) {
                if ((claims[i].claimType == claimType && claims[i].claimValue == value)
                    || (claims[i].claimType == 'CANDOANYTHING' && claims[i].claimValue == 'True')) {
                    result = true;
                    break;
                }
            }
        return result;
    }
    static isLoggedIn() {
        var currentUser = useAuthStore().getUsername();
        if (currentUser)
            return true;
        return false;
    }
}