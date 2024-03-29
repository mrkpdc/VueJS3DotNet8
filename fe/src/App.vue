<template>
    <n-config-provider :theme="lightTheme"
                       :theme-overrides="themeOverrides"
                       :locale="selectedLocale"
                       :date-locale="selectedDateLocale">
        <!--<n-theme-editor>-->
        <n-dialog-provider>
            <n-message-provider>
                <header>
                    <div class="wrapper">
                        <n-el tag="nav"
                              class="navbar layoutBGColor">
                            <div class="container-fluid">
                                <a class="navbar-brand">
                                    <n-button type="info" class="layoutBGColor" v-on:click="navBarIsOpen = true">{{$t('menu')}}</n-button>
                                </a>
                                <form class="d-flex" role="search">
                                    <div class="dropdown">
                                        <n-button type="info"
                                                  class="layoutBGColor"
                                                  data-bs-toggle="dropdown">{{$t('language')}}</n-button>
                                        <ul class="dropdown-menu dropdown-menu-end" style="margin:unset">
                                            <li><a class="dropdown-item" href="#" v-on:click="setLanguage('en', enUS, dateEnUS)">{{$t('english')}}</a></li>
                                            <li><a class="dropdown-item" href="#" v-on:click="setLanguage('it', itIT, dateItIT)">{{$t('italian')}}</a></li>
                                        </ul>
                                    </div>
                                    <div v-if="isLoggedIn && Auth.checkClaim('CanUseNotifications')" class="notificationBell" v-on:click="openNotificationsBar()">
                                        <div v-if="!hasNotifications">
                                            <n-icon size="24" color="white">
                                                <Alert20Regular />
                                            </n-icon>
                                        </div>
                                        <div v-if="hasNotifications">
                                            <n-icon size="24" color="red">
                                                <Alert20Filled />
                                            </n-icon>
                                        </div>
                                    </div>
                                </form>                               
                            </div>
                        </n-el>
                        <n-drawer v-model:show="navBarIsOpen" :placement="'left'">
                            <!--<n-drawer-content :title="$t('applicationTitle')">-->
                            <n-drawer-content :body-content-style="{'padding':'0'}">
                                <!--questo è un n-el per applicare lo stile con var() nel css, altrimenti in un div
            normale non lo mette-->
                                <n-el tag="div" class="navigationContainer layoutBGColor baseTextColor text-center">
                                    <h3 class="baseTextColor mt-3">{{$t('applicationTitle')}}</h3>
                                    <div class="navigationContent mt-5">
                                        <div class="navigationItem">
                                            <router-link to="/" class="fs-5 text-decoration-none">
                                                <button class="navigationButton bg-transparent navigationSubItem baseTextColor"
                                                        type="button"
                                                        v-on:click="navBarIsOpen = false">
                                                    {{$t('home')}}
                                                </button>
                                            </router-link>
                                        </div>
                                        <div class="navigationItem">
                                            <router-link to="/about" class="fs-5 text-decoration-none">
                                                <button class="navigationButton bg-transparent navigationSubItem baseTextColor"
                                                        type="button"
                                                        v-on:click="navBarIsOpen = false">
                                                    {{$t('about')}}
                                                </button>
                                            </router-link>
                                        </div>
                                        <div class="navigationItem">
                                            <router-link to="/api" class="fs-5 text-decoration-none">
                                                <button class="navigationButton bg-transparent navigationSubItem baseTextColor"
                                                        type="button"
                                                        v-on:click="navBarIsOpen = false">
                                                    {{$t('api')}}
                                                </button>
                                            </router-link>
                                        </div>
                                        <div class="navigationItem" v-if="Auth.checkClaim('CanRegisterToSignalR')">
                                            <router-link to="/signalr" class="fs-5 text-decoration-none">
                                                <button class="navigationButton bg-transparent navigationSubItem baseTextColor"
                                                        type="button"
                                                        v-on:click="navBarIsOpen = false">
                                                    {{$t('signalR')}}
                                                </button>
                                            </router-link>
                                        </div>
                                        <div class="mt-1" v-if="Auth.checkClaim('CANDOANYTHING')">
                                            <button class="navigationButton bg-transparent"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseAdmin">
                                                <div class="text-decoration-none fs-5 dropdown-toggle navigationItem baseTextColor">
                                                    <span class="navigationSubItem">
                                                        {{$t('administration')}}
                                                    </span>
                                                </div>
                                            </button>
                                            <div class="collapse" id="collapseAdmin">
                                                <div class="cursorPointer navigationItem"
                                                     v-on:click="navBarIsOpen = false"
                                                     v-if="Auth.checkClaim('CANDOANYTHING')">
                                                    <router-link to="/auth/users" class="fs-6 text-decoration-none">
                                                        <button class="navigationButton bg-transparent navigationSubItem baseTextColor"
                                                                type="button"
                                                                v-on:click="navBarIsOpen = false">
                                                            {{$t('users')}}
                                                        </button>
                                                    </router-link>
                                                </div>
                                                <div class="cursorPointer navigationItem"
                                                     v-on:click="navBarIsOpen = false"
                                                     v-if="Auth.checkClaim('CANDOANYTHING')">
                                                    <router-link to="/auth/roles" class="fs-6 text-decoration-none">
                                                        <button class="navigationButton bg-transparent navigationSubItem baseTextColor"
                                                                type="button"
                                                                v-on:click="navBarIsOpen = false">
                                                            {{$t('roles')}}
                                                        </button>
                                                    </router-link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="navigationFooter" v-if="isLoggedIn">
                                        <div>{{useAuthStore().getUsername()}}</div>
                                        <n-button type="info" v-on:click="Auth.logout(); navBarIsOpen = false">{{$t('logout')}}</n-button>
                                    </div>
                                </n-el>
                            </n-drawer-content>
                        </n-drawer>
                        <n-drawer v-model:show="notificationsBarIsOpen" :placement="'right'" resizable default-width="500" :on-after-leave="() => { closeNotificationsBar(); }">
                            <n-drawer-content :body-content-style="{'padding':'0'}">
                                <n-el tag="div" class="notificationsContainer layoutBGColor baseTextColor text-center">
                                    <n-grid cols="24" class="mt-3">
                                        <n-grid-item span="22">
                                        </n-grid-item>
                                        <n-grid-item span="2" class="align-self-center">
                                            <n-button text v-on:click="notificationsBarIsOpen = false">
                                                <n-icon size="24" color="white">
                                                    <Dismiss20Filled />
                                                </n-icon>
                                            </n-button>                                              
                                        </n-grid-item>
                                    </n-grid>
                                    <div class="notificationsContent p-2 text-start">
                                        <div v-if="notifications.length > 0">
                                            <n-grid cols="24" responsive="screen" v-for="notification in notifications"
                                                    class="mt-3"
                                                    :class="{ unreadNotification: !notification.readDate}">
                                                <n-grid-item span="24">
                                                    <n-grid cols="24">
                                                        <n-grid-item span="22">id: {{notification.id}}</n-grid-item>
                                                        <n-grid-item span="2">
                                                            <n-button text type="info" v-on:click="deleteNotification(notification.id)">
                                                                <n-icon size="20" color="red">
                                                                    <Delete20Filled />
                                                                </n-icon>
                                                            </n-button>
                                                        </n-grid-item>
                                                    </n-grid>
                                                </n-grid-item>
                                                <n-grid-item span="24">
                                                    senderId: {{notification.senderId}}
                                                </n-grid-item>
                                                <n-grid-item span="24">
                                                    recipientId: {{notification.recipiendId}}
                                                </n-grid-item>
                                                <n-grid-item span="24">
                                                    message: {{notification.message}}
                                                </n-grid-item>
                                                <n-grid-item span="24">
                                                    creationDate: {{notification.creationDate}}
                                                </n-grid-item>
                                                <n-grid-item span="24">
                                                    readDate: {{notification.readDate}}
                                                </n-grid-item>
                                            </n-grid>
                                        </div>
                                        <div v-if="notifications.length == 0">
                                            <h5 class="text-center">{{$t('noNotifications')}}</h5>
                                        </div>
                                    </div>
                                </n-el>
                            </n-drawer-content>
                        </n-drawer>
                    </div>
                </header>
                <router-view />
            </n-message-provider>
        </n-dialog-provider>
        <!--<n-global-style />-->
        <!--</n-theme-editor>-->
    </n-config-provider>
</template>

<style scoped lang="scss">
    /*@import "@/style/globalVariables.module.scss";

    .navbarBGColor {
        background-color: v-bind(navColor); // $primaryColor;
    }*/
    .layoutBGColor {
        background-color: var(--info-color-pressed);
    }

    .navigationContainer {
        display: flex;
        min-height: 100%;
        flex-direction: column;
    }

    .navigationContent {
    }

    .navigationButton {
        width: 100%;
        border: none;
    }

    .baseTextColor {
        color: white;
    }

    .navigationItem:hover {
        /*color: @primary-9;*/
        background-color: white;
        color: var(--info-color-pressed);
    }

    .navigationSubItem {
        /*background-color: var(--primary-color) !important;*/
        color: white;
    }

    .navigationItem:hover .navigationSubItem {
        /*color: @primary-9;*/
        /*background-color: var(--primary-color);*/
        color: var(--info-color-pressed);
    }

    .navigationFooter {
        height: 30%;
        margin-top: auto;
    }

    .cursorPointer {
        cursor: pointer;
    }

    .notificationBell {
        padding-left: 20px;
        padding-right: 20px;
    }

    .notificationsContainer {
        display: flex;
        min-height: 100%;
        flex-direction: column;
    }

    .unreadNotification {
        font-weight: bold;
    }

    </style>

<script setup lang="ts">
    import { getCurrentInstance, onMounted, ref } from 'vue';
    import { Auth } from '@/auth/auth';
    import { Api } from '@/api/api';

    //questo è necessario per lo stile di naive
    import { NConfigProvider, NThemeEditor, darkTheme, lightTheme } from 'naive-ui';

    import Alert20Regular from '@vicons/fluent/Alert20Regular';
    import Alert20Filled from '@vicons/fluent/Alert20Filled';
    import Delete20Filled from '@vicons/fluent/Delete20Filled';
    import Dismiss20Filled from '@vicons/fluent/Dismiss20Filled';

    //questo è per salvare il locale nel localstorage
    import { useLanguageAndLocaleStore } from '@/stores/languageAndLocale';

    //questo è usato sopra per far vedere lo username dell'utente loggato
    import { useAuthStore } from '@/stores/auth';

    //questo serve per la connessione a signalR, che viene fatta nell onmounted
    import { SignalR } from './signalr/signalr';

    /*lo store delle notifiche di default dice solo se ci sono notifiche o meno*/
    import { useNotificationsStore } from '@/stores/notifications';

    //questi sono per la localizzazione dei component di naiveui
    import { enUS, itIT, dateEnUS, dateItIT } from 'naive-ui';
    import type { NLocale, NDateLocale } from 'naive-ui'

    /*queste sono le variabili globali del css per applicarle
     sotto al themeOverrides di modo che abbiano effetto in tutta l'applicazione*/
    import variables from "@/style/globalVariables.module.scss";
    import { useSignalRStore } from './stores/signalr';
    import constantValues from './common/constantValues';

    /*fa l'override del tema generico di naive con le variabili nel globalVariables.module.scss.
     gli si possono anche scrivere direttamente i valori, tipo 'black' o esadecimali*/
    const themeOverrides: any = {
        common: {
            //popoverColor: variables.popoverColor,
            //primaryColor: variables.primaryColor,
            //infoColor: variables.color2
        }
    }
    var navBarIsOpen = ref(false);

    /*a prescindere dai valori settati nel main.ts, qui viene settato il valore che
     eventualmente era stato settato nello store e nel localstorage*/
    onMounted(() => {
        var languageAndLocale = languageAndLocaleStore.LanguageAndLocale;
        setLanguage(languageAndLocale.language, languageAndLocale.locale, languageAndLocale.dateLocale);
        if (isLoggedIn.value && Auth.checkClaim(constantValues.authClaims.CanRegisterToSignalR)) {
            /*solo se l'utente è loggato, facciamo anche partire la connessione iniziale a signalR,
            che quando si connetterà farà anche la prima getNotifications*/
            SignalR.startSignalR();
        }
    });

    //<languages>
    //questi sono per usare esplicitamente la funzione di traduzione se dovesse servire
    //import { useI18n } from 'vue-i18n';
    //const { t } = useI18n();
    var selectedLocale = ref<NLocale | null>(null);
    var selectedDateLocale = ref<NDateLocale | null>(null);

    /*lo store mi serve per salvare la lingua nel localstorage*/
    const languageAndLocaleStore = useLanguageAndLocaleStore();
    /*si cambia la lingua dell'i18n accedendo alla proprietà globale della currentInstance
    di vue. getCurrentInstance() si può fare solo fuori da una funzione o in un lifecycle hook,
    non in una funzione normale*/
    var currentInstance = getCurrentInstance();
    function setLanguage(languageKey: string, locale: any, dateLocale: any) {
        selectedLocale.value = locale;
        selectedDateLocale.value = dateLocale;
        languageAndLocaleStore.setLanguage(languageKey);
        if (currentInstance?.appContext?.config?.globalProperties?.$i18n?.locale)
            currentInstance.appContext.config.globalProperties.$i18n.locale = languageKey;
    }
    //</languages>

    //<isLoggedIn>
    var isLoggedIn = ref(Auth.isLoggedIn());
    /*questo serve per prendere se l'utente è loggato*/
    const authStoreSubscription = useAuthStore().$onAction(
        ({
            name, // name of the action
            store, // store instance, same as `someStore`
            args, // array of parameters passed to the action
            after, // hook after the action returns or resolves
            onError, // hook if the action throws or rejects
        }) => {
            after((result) => {
                if (name == 'removeUsername') {
                    isLoggedIn.value = false;
                    /*se l'utente è stato sloggato spengo anche il websocket e chiudo la
                    barra delle notifiche. non chiamo la CloseNotificationsBar perché quella
                    chiama anche la setUnreadNotificationsAsRead, che ovviamente non posso
                    raggiungere perché sono sloggato*/
                    SignalR.stopSignalR();
                    notificationsBarIsOpen.value = false;
                }
                else if (name == 'setUsername') {
                    isLoggedIn.value = true;
                    /*se l'utente si è appena loggato connetto il websocket*/
                    if (Auth.checkClaim(constantValues.authClaims.CanRegisterToSignalR))
                        SignalR.startSignalR();
                }
            })
            onError((error) => {
            })
        }
    )
    //</isLoggedIn>

    //<notifications>
    var hasNotifications = ref(false);
    var notificationsBarIsOpen = ref(false);
    var notifications = ref([]);
    const notificationsStoreSubscription = useNotificationsStore().$onAction(
        ({
            name, // name of the action
            store, // store instance, same as `someStore`
            args, // array of parameters passed to the action
            after, // hook after the action returns or resolves
            onError, // hook if the action throws or rejects
        }) => {
            after((result) => {
                if (name == 'setHasNotifications') {
                    //il valore settato nello store è sotto args
                    hasNotifications.value = args[0];
                }
            })
            onError((error) => {
            })
        }
    )
    const signalRStoreSubscription = useSignalRStore().$onAction(
        ({
            name, // name of the action
            store, // store instance, same as `someStore`
            args, // array of parameters passed to the action
            after, // hook after the action returns or resolves
            onError, // hook if the action throws or rejects
        }) => {
            after((result) => {
                if (name == 'setCachedSignalRConnectionId') {
                    getNotifications();
                }
            })
            onError((error) => {
            })
        }
    )
    function openNotificationsBar() {
        notificationsBarIsOpen.value = true;
        getNotifications();
    }
    /*questa è la close con l'evento della notificationsBar, che setta
    anche come lette le notifiche*/
    function closeNotificationsBar() {
        notificationsBarIsOpen.value = false;
        useNotificationsStore().setHasNotifications(false);
        setUnreadNotificationsAsRead();
    }
    function getNotifications() {
        Api.getNotifications().then((response: any) => {
            console.log(response);
            notifications.value = response.data.notifications;
            for (let i = 0; i < response.data.notifications.length; i++) {
                if (!response.data.notifications[i].readDate) {
                    //hasNotifications.value = true;
                    useNotificationsStore().setHasNotifications(true);
                    break;
                }
            }
        }).catch((error: any) => {
            console.log(error);
        }).then(() => {
        });
    }
    function setUnreadNotificationsAsRead() {
        Api.setUnreadNotificationsAsRead().then((response: any) => {

        }).catch((error: any) => {
            console.log(error);
        }).then(() => {
        });
    }
    function deleteNotification(notificationId: string) {
        Api.deleteNotification(notificationId).then((response: any) => {
            getNotifications();
        }).catch((error: any) => {
            console.log(error);
        }).then(() => {
        });
    }
    //</notifications>
</script>