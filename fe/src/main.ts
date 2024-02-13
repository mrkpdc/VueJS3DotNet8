import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
//questo importa da un modulo ts
import { messages } from '@/language/translations';
/*questo importa da un json, ma comunque viene compilato
 e per cambiarlo bisogna poi ricompilare*/
//import messages from '@/language/translations.json';

import App from '@/App.vue';
import { Logger } from '@/logger/logger';
import { Auth } from '@/auth/auth';
import constantValues from '@/common/constantValues';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from '@/router/router';
import naive from 'naive-ui';

/*questo carica il js, ma l'scss deve essere caricato
 indipendentemente.. wtf*/
import 'bootstrap';

/*questi due sono per usare bootstrap, e ovviamente
 l'ordine di import è importante, perché l'override
 deve essere caricato dopo bootstrap.*/
import 'bootstrap/scss/bootstrap.scss';
import '@/style/bootstrapOverrides.scss';

/*questo applica globalmente lo stile in questo file
 e DEVE essere caricato qui.
 il file globalVariables.module.scss invece viene caricato
 principalmente nell'App.vue per fare l'override del tema
 generico.
 può inoltre essere importato in qualsiasi component
 per leggerne le variabili.
 l'esempio è direttamente in globalVariables.module.scss
 nel commento iniziale.
 viene caricato per ultimo per eventualmente sovrascrivere
 anche i settaggi di default di bootstrap*/
import '@/style/globalStyle.scss';
import { useAuthStore } from '@/stores/auth';


axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (request) {
    // Do something before request is sent
    if (!request.url?.startsWith(constantValues.backendUrl))
        request.url = constantValues.backendUrl + request.url;
    //console.log("request");
    //console.log(request);

    if (!request.url.endsWith('Auth/RefreshTokens')) {
        const token = useAuthStore().getJWTToken();
        request.headers.setAuthorization("Bearer " + token);
    }
    else {
        const refreshToken = useAuthStore().getJWTRefreshToken();
        request.headers.setAuthorization("Bearer " + refreshToken);
    }

    return request;
}, function (error) {
    // Do something with request error
    //console.log("error");
    //console.log(error);
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //console.log("response");
    //console.log(response);
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    //console.error("response error: " + error.config.url, error);
    if (error.response.status === 401/*|| error.response.status == 404*/) {
        if (!error.config.url.endsWith('Auth/RefreshTokens')) {
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
                while (refreshingToken && !errorRefreshingToken) {
                    //console.log("waiting refresh token..");
                    await new Promise(r => setTimeout(r, 500));
                }
                if (errorRefreshingToken) {
                    //console.log("error refreshing token !");
                }
                else {
                    //console.log("token refreshed !");
                    return axios(error.config);
                }
            }
            else
                Auth.logout();
        }
        else {
            //console.log(error);
            Auth.logout(); //sloggarsi !
        }
    }
    /*loggo qualsiasi errore che non sia stato originato dal controller del log, altrimenti
     si va in loop.. e non loggo i 401 dei vari token scaduti*/
    if (!error.config.url.endsWith('Log/LogInfo')
        && !error.config.url.endsWith('Log/LogError')
        && error.response?.status !== 401) {
        Logger.logRESTRequestErrorToServer(error);
    }
    //console.log("returning promise error !");
    return Promise.reject(error);
});

const app = createApp(App);

/*di default gli setto inglese, perché poi il valore effettivo
 viene scritto in App.vue nell'onMounted*/
const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: 'en',
    fallbackLocale: 'en',
    messages: messages
})

/*custom error handler che logga in console l'errore ma chiama anche il backend
 per loggare*/
app.config.errorHandler = function (err, instance, info) {
    console.error(err);
    console.error(instance);
    console.error(info);
    Logger.logGenericErrorToServer(err, instance, info);
}

app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);
app.use(createPinia());
app.use(i18n);
app.use(router);
app.use(naive);
app.mount('#app');
