<template>
    <n-spin :show="pageIsLoading">
        <div v-if="isLoggedIn">
            <div class="text-center">{{$t('welcome')}} {{useAuthStore().getUsername()}}</div>
        </div>
        <div v-if="!isLoggedIn">
            <n-grid cols="3 s:3 m:5 l:5 xl:7 2xl:7" responsive="screen">
                <n-grid-item span="1 s:1 m:2 l:2 xl:3 2xl:3"></n-grid-item>
                <n-grid-item span="1 s:1 m:1 l:1 xl:1 2xl:1">
                    <n-input v-model:value="username" type="text" :placeholder="$t('username')" />
                    <n-input type="password"
                             v-model:value="password"
                             show-password-on="mousedown"
                             :placeholder="$t('password')" />
                    <div class="text-center">
                        <n-button type="info" v-on:click="login()">{{$t('login')}}</n-button>
                    </div>
                </n-grid-item>
                <n-grid-item span="1 s:1 l:2 m:2 xl:3 2xl:1"></n-grid-item>
            </n-grid>
        </div>
    </n-spin>
</template>

<style scoped lang="scss">
    /*@import "@/style/globalVariables.module.scss";*/
    .light-green {
        height: 108px;
        background-color: red;
    }

    .green {
        height: 108px;
        background-color: yellow;
    }
</style>
<script setup lang="ts">
    import { Auth } from '@/auth/auth';
    //questo è usato sopra per far vedere lo username dell'utente loggato
    import { useAuthStore } from '@/stores/auth';
    import { ref } from "vue";

    var pageIsLoading = ref(false);
    var username = ref('');
    var password = ref('');

    var isLoggedIn = ref(Auth.isLoggedIn());

    /*questo serve per prendere se l'utente � loggato
     e far vedere il form di login o il welcome*/
    const unsubscribe = useAuthStore().$onAction(
        ({
            name, // name of the action
            store, // store instance, same as `someStore`
            args, // array of parameters passed to the action
            after, // hook after the action returns or resolves
            onError, // hook if the action throws or rejects
        }) => {
            //// a shared variable for this specific action call
            //const startTime = Date.now()
            //// this will trigger before an action on `store` is executed
            //console.log(`Start "${name}" with params [${args.join(', ')}].`)

            //// this will trigger if the action succeeds and after it has fully run.
            //// it waits for any returned promised
            after((result) => {
                if (name == 'removeUsername') {
                    isLoggedIn.value = false;
                    username.value = '';
                    password.value = '';
                }
                else if (name == 'setUsername') {
                    isLoggedIn.value = true;
                    username.value = '';
                    password.value = '';
                }
                //console.log(
                //    `Finished "${name}" after ${Date.now() - startTime
                //    }ms.\nResult: ${result}.`
                //)
            })
            // this will trigger if the action throws or returns a promise that rejects
            onError((error) => {
                //console.warn(
                //    `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
                //)
            })
        }
    )

    function login() {
        pageIsLoading.value = true;
        Auth.login(username.value, password.value, () => {
            pageIsLoading.value = false;
        });
    }
</script>