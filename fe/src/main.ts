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
import { SignalR } from './signalr/signalr';


axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (request) {
    // Do something before request is sent
    request.url = constantValues.backendUrl + request.url;
    //console.log("request");
    //console.log(request);
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
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.error(error);
    if (error.response.status == 401 /*|| error.response.status == 404*/) {
        Auth.logout();
    }
    /*loggo qualsiasi errore che non sia stato originato dal controller del log, altrimenti
     si va in loop..*/
    if (!error.request.responseURL.endsWith('Log/LogInfo')
        && !error.request.responseURL.endsWith('Log/LogError')) {
        Logger.logRESTRequestErrorToServer(error);
    }
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