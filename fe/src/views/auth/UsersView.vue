<template>
    <n-spin :show="pageIsLoading">
        <h1 class="text-center">{{$t('users')}}</h1>
        <div class="usersContainer">
            <n-grid cols="12 s:12 m:12 l:12 xl:12 2xl:12" responsive="screen">
                <n-grid-item span="12 s:6 m:4 l:4 xl:4 2xl:4">
                    <n-input-group>
                        <n-input :placeholder="$t('name')" v-model:value="usernameFilter" />
                        <n-input :placeholder="$t('email')" v-model:value="emailFilter" />
                        <n-button type="info" strong v-on:click="getUsers()">
                            {{$t('search')}}
                        </n-button>
                        <n-button type="default" color="gray" strong v-on:click="clearSearchUsers()">
                            {{$t('clear')}}
                        </n-button>
                    </n-input-group>
                </n-grid-item>
            </n-grid>
            <br />
            <n-grid>
                <n-grid-item>
                    <n-button type="info" v-on:click="openUserModal()">{{$t('addUser')}}</n-button>
                </n-grid-item>
            </n-grid>
            <div v-for="user in users">
                <n-grid cols="24" responsive="screen" class="mt-3">
                    <n-grid-item span="8">
                        <h3 class="wordBreakText">
                            <n-button text type="info" v-on:click="deleteUser(user.id)">
                                <n-icon size="25" color="red">
                                    <Delete20Filled />
                                </n-icon>
                            </n-button>
                            <n-button text type="info">
                                <n-icon size="25" color="orange" v-on:click="openUserModal(user)">
                                    <Edit20Filled />
                                </n-icon>
                            </n-button>
                            {{user.userName}}
                        </h3>
                        <n-grid cols="12" responsive="screen">
                            <n-grid-item span="12">
                                {{$t('id')}}: {{user.id}}
                                <br />
                                {{$t('username')}}: {{user.userName}}
                                <br />
                                {{$t('email')}}: {{user.email}}
                            </n-grid-item>
                        </n-grid>
                    </n-grid-item>
                    <n-grid-item span="8">
                        <h4>{{$t('userClaims')}}</h4>
                        <n-grid cols="12" responsive="screen" v-for="claim in user.userClaims">
                            <n-grid-item span="12">
                                <n-button text type="info" v-on:click="removeClaimFromUser(user.id, claim.claimType, claim.claimValue, ()=>{getUsers();})">
                                    <n-icon size="20" color="red">
                                        <Delete20Filled />
                                    </n-icon>
                                </n-button>
                                {{claim.claimType}} {{claim.claimValue}}
                            </n-grid-item>
                        </n-grid>
                        <n-grid cols="12">
                            <n-grid-item span="12">
                                <n-button type="info" v-on:click="openAddCustomClaimModal(user.id)">{{$t('customClaim')}}</n-button>
                                <n-button type="info" v-on:click="openExistingClaimsModal(user.id)">{{$t('existingClaims')}}</n-button>
                            </n-grid-item>
                        </n-grid>
                    </n-grid-item>
                    <n-grid-item span="8">
                        <h4>{{$t('userRoles')}}</h4>
                        <n-grid cols="12" responsive="screen" v-for="role in user.userRoles">
                            <n-grid-item span="12">
                                <n-grid-item span="4">
                                    <h5 class="wordBreakText">
                                        <n-button text type="info" v-on:click="removeRoleFromUser(user.id, role.name, ()=>{getUsers();})">
                                            <n-icon size="20" color="red">
                                                <Delete20Filled />
                                            </n-icon>
                                        </n-button>
                                        {{role.name}}
                                    </h5>
                                </n-grid-item>
                                <n-grid-item span="4">
                                    <h6>{{$t('claims')}}</h6>
                                    <div v-for="roleClaim in role.roleClaims">
                                        <div nz-col class="wordBreakText">
                                            {{roleClaim.claimType}} {{roleClaim.claimValue}}
                                        </div>
                                    </div>
                                    <hr />
                                </n-grid-item>

                            </n-grid-item>
                        </n-grid>
                        <n-grid>
                            <n-grid-item span="4">
                                <n-button type="info" v-on:click="openExistingRolesModal(user.id)">{{$t('addRole')}}</n-button>
                            </n-grid-item>
                        </n-grid>
                    </n-grid-item>
                </n-grid>
                <hr />
            </div>
        </div>
        <!--user form-->
        <n-modal v-model:show="userModalIsVisible">
            <n-spin :show="pageIsLoading">
                <n-card style="max-width: 400px" size="small">
                    <template #header>
                        <div class="text-center">
                            {{addOrUpdateUser}}
                        </div>
                    </template>
                    <label>{{$t('username')}}</label>
                    <n-input :placeholder="$t('username')" v-model:value="selectedUsername" :status="selectedUsername == '' ? 'error': null" />
                    <label>{{$t('email')}}</label>
                    <n-input :placeholder="$t('email')" v-model:value="selectedEmail" :status="Utilities.validateEmail(selectedEmail) == false ? 'error': null" />
                    <label>{{$t('password')}}</label>
                    <n-input :placeholder="$t('password')" type="password" show-password-on="mousedown" v-model:value="selectedPassword" :status="validateSelectedPassword(selectedPassword) == false ? 'error': null" />
                    <div v-if="validateSelectedPassword(selectedPassword) == false" style="color:red">
                        {{$t('passwordValidityTooltip')}}
                    </div>
                    <label>{{$t('confirmPassword')}}</label>
                    <n-input :placeholder="$t('confirmPassword')" type="password" show-password-on="mousedown" v-model:value="selectedConfirmPassword" :status="validateSelectedConfirmPassword(selectedPassword, selectedConfirmPassword) == false ? 'error': null" />
                    <template #footer>
                        <div class="text-end">
                            <n-button type="default" size="small" v-on:click="closeUserModal()">
                                {{$t('cancel')}}
                            </n-button>
                            <n-button type="info" size="small" style="margin-left:12px" v-on:click="confirmUserModal()">
                                {{$t('ok')}}
                            </n-button>
                        </div>
                    </template>
                </n-card>
            </n-spin>
        </n-modal>
        <!--/user form-->
        <!--claims form-->
        <n-modal v-model:show="claimsModalIsVisible">
            <n-spin :show="pageIsLoading">
                <n-card style="max-width: 400px" size="small">
                    <template #header>
                        <div class="text-center">
                            {{$t('customClaim')}}
                        </div>
                    </template>
                    <n-input :placeholder="$t('type')" v-model:value="selectedClaimType" :status="selectedClaimType == '' ? 'error': null" />
                    <n-input :placeholder="$t('value')" v-model:value="selectedClaimValue" :status="selectedClaimValue == '' ? 'error': null" />
                    <template #footer>
                        <div class="text-end">
                            <n-button type="default" size="small" v-on:click="closeAddCustomClaimModal()">
                                {{$t('cancel')}}
                            </n-button>
                            <n-button type="info" size="small" style="margin-left:12px" v-on:click="addCustomClaimToUser()">
                                {{$t('ok')}}
                            </n-button>
                        </div>
                    </template>
                </n-card>
            </n-spin>
        </n-modal>
        <!--/claims form-->
        <!--existing claims-->
        <n-modal v-model:show="existingClaimsModalIsVisible">
            <n-spin :show="pageIsLoading">
                <n-card style="min-width: 400px; min-height:500px" size="small">
                    <template #header>
                        <div class="text-center">
                            {{$t('existingClaims')}}
                        </div>
                    </template>
                    <n-input :placeholder="$t('typeOrValue')" v-model:value="existingClaimsFilter" v-on:input="searchExistingClaims" />
                    <n-data-table :columns="existingClaimsColumns"
                                  :data="existingClaimsFiltered"
                                  :pagination="{pageSize: 5}" />
                    <template #footer>
                        <div class="text-end">
                            <n-button type="default" size="small" v-on:click="closeExistingClaimsModal()">
                                {{$t('close')}}
                            </n-button>
                        </div>
                    </template>
                </n-card>
            </n-spin>
        </n-modal>
        <!--/existing claims-->
        <!--existing roles-->
        <n-modal v-model:show="existingRolesModalIsVisible">
            <n-spin :show="pageIsLoading">
                <n-card style="min-width: 400px; min-height:500px" size="small">
                    <template #header>
                        <div class="text-center">
                            {{$t('existingRoles')}}
                        </div>
                    </template>
                    <n-input :placeholder="$t('typeOrValue')" v-model:value="existingRolesFilter" v-on:input="searchExistingRoles" />
                    <n-data-table :columns="existingRolesColumns"
                                  :data="existingRolesFiltered"
                                  :pagination="{pageSize: 5}" />
                    <template #footer>
                        <div class="text-end">
                            <n-button type="default" size="small" v-on:click="closeExistingRolesModal()">
                                {{$t('close')}}
                            </n-button>
                        </div>
                    </template>
                </n-card>
            </n-spin>
        </n-modal>
        <!--/existing roles-->
    </n-spin>
</template>

<style scoped lang="scss">
    @import "@/style/globalVariables.module.scss";

    .usersContainer {
        padding: 30px;
    }

    .wordBreakText {
        word-break: break-word;
    }

    .iconVerticalAlign {
        vertical-align: text-top;
    }

    .pointerCursor {
        cursor: pointer;
    }

    .redColor {
        color: red;
    }

    .orangeColor {
        color: orange;
    }
</style>
<script setup lang="ts">
    import { Admin } from '@/admin/admin';
    import { NIcon, useDialog, useMessage, type DataTableColumns } from 'naive-ui';
    import { onMounted, ref, h, watch } from 'vue';
    import { useI18n } from 'vue-i18n';

    import Delete20Filled from '@vicons/fluent/Delete20Filled';
    import Edit20Filled from '@vicons/fluent/Edit20Filled';
    import Checkmark20Filled from '@vicons/fluent/Checkmark20Filled';
    import Dismiss20Filled from '@vicons/fluent/Dismiss20Filled';
    import { Utilities } from '@/utilities/utilities';

    const { t, locale } = useI18n();
    const dialog = useDialog();
    const message = useMessage();

    var pageIsLoading = ref(false);
    var users = ref<any[]>([]);
    var usernameFilter = ref('');
    var emailFilter = ref('');

    //<users>
    var userModalIsVisible = ref(false);
    var addOrUpdateUser = ref('');
    var selectedUserId = ref('');
    var selectedUsername = ref('');
    var selectedEmail = ref('');
    var selectedPassword = ref('');
    var selectedConfirmPassword = ref('');
    //</users>

    //<claims>
    var claimsModalIsVisible = ref(false);
    var selectedClaimType = ref('');
    var selectedClaimValue = ref('');
    //</claims>

    //<existing claims>
    var existingClaimsModalIsVisible = ref(false);
    var existingClaimsFilter = ref('');
    var existingClaimsFiltered = ref<any>([]);
    var existingClaims = ref<any[]>([]);
    var existingClaimsColumns = getExistingClaimsColumns();
    /*questo watch è necessario per ricaricare le traduzioni di title delle colonne,
     altrimenti restano sempre le stesse*/
    watch(locale, () => {
        existingClaimsColumns = getExistingClaimsColumns();
    });
    function getExistingClaimsColumns(): DataTableColumns<any> {
        return [
            {
                title: t('added'),
                key: 'hasClaim',
                render: (item: any, index: any) => {
                    if (item.hasClaim) {
                        return h(NIcon, {
                            size: '20',
                            color: 'green',
                            style: 'cursor: pointer'
                        },
                            () => [h(Checkmark20Filled,
                                {
                                    onClick(event: any) {
                                        removeExistingClaimFromUser(item.claim.claimType, item.claim.claimValue);
                                    }
                                })]
                        );
                    }
                    else
                        return h(NIcon, {
                            size: '20',
                            color: 'red',
                            style: 'cursor: pointer'
                        },
                            () => [h(Dismiss20Filled,
                                {
                                    onClick(event: any) {
                                        addExistingClaimToUser(item.claim.claimType, item.claim.claimValue);
                                    }
                                })]
                        );
                },
                sorter(rowA: any, rowB: any) {
                    return rowA.hasClaim - rowB.hasClaim;
                }
            },
            {
                title: t('type'),
                key: 'claimType',
                render: (item: any, index: any) => {
                    return item.claim.claimType;
                },
                sorter: (rowA: any, rowB: any) => {
                    return rowA.claim.claimType.toLowerCase().localeCompare(rowB.claim.claimType.toLowerCase());
                }
            },
            {
                title: t('value'),
                key: 'claimValue',
                render: (item: any, index: any) => {
                    return item.claim.claimValue;
                },
                sorter: (rowA: any, rowB: any) => {
                    return rowA.claim.claimValue.toLowerCase().localeCompare(rowB.claim.claimValue.toLowerCase());
                }
            }
        ];
    }
    //</existing claims>

    //<existing roles>
    var existingRolesModalIsVisible = ref(false);
    var existingRolesFilter = ref('');
    var existingRolesFiltered = ref<any>([]);
    var existingRoles = ref<any[]>([]);
    var existingRolesColumns = getExistingRolesColumns();
    /*questo watch è necessario per ricaricare le traduzioni di title delle colonne,
     altrimenti restano sempre le stesse*/
    watch(locale, () => {
        existingRolesColumns = getExistingRolesColumns();
    });
    function getExistingRolesColumns(): DataTableColumns<any> {
        return [
            {
                title: t('added'),
                key: 'hasRole',
                render: (item: any, index: any) => {
                    if (item.hasRole) {
                        return h(NIcon, {
                            size: '20',
                            color: 'green',
                            style: 'cursor: pointer'
                        },
                            () => [h(Checkmark20Filled,
                                {
                                    onClick(event: any) {
                                        removeExistingRoleFromUser(item.role.name, () => { getExistingRoles(selectedUserId.value); getUsers(); });
                                    }
                                })]
                        );
                    }
                    else
                        return h(NIcon, {
                            size: '20',
                            color: 'red',
                            style: 'cursor: pointer'
                        },
                            () => [h(Dismiss20Filled,
                                {
                                    onClick(event: any) {
                                        addExistingRoleToUser(item.role.name, () => { getExistingRoles(selectedUserId.value); getUsers(); });
                                    }
                                })]
                        );
                },
                sorter(rowA: any, rowB: any) {
                    return rowA.hasRole - rowB.hasRole;
                }
            },
            {
                title: t('name'),
                key: 'name',
                render: (item: any, index: any) => {
                    return item.role.name;
                },
                sorter: (rowA: any, rowB: any) => {
                    return rowA.role.name.toLowerCase().localeCompare(rowB.role.name.toLowerCase());
                }
            }
        ];
    }
    //</existing roles>

    onMounted(() => {
        getUsers();
    });

    //<get users>
    function getUsers() {
        pageIsLoading.value = true;
        Admin.getUsers(usernameFilter.value, emailFilter.value)
            .then((response: any) => {
                users.value = response.data;
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }
    function clearSearchUsers() {
        usernameFilter.value = '';
        emailFilter.value = '';
        getUsers();
    }
    //</get users>

    //<user modal>
    function openUserModal(user?: any) {
        if (user) {
            addOrUpdateUser.value = t('updateUser');
            resetUserModel();
            selectedUserId.value = user.id;
            selectedUsername.value = user.userName;
            selectedEmail.value = user.email;
        }
        else {
            addOrUpdateUser.value = t('addUser');
            resetUserModel();
        }
        userModalIsVisible.value = true;
    }
    function closeUserModal() {
        userModalIsVisible.value = false;
        resetUserModel();
    }
    function confirmUserModal() {
        if (selectedUserId.value != '')
            updateUser();
        else
            insertUser();
    }
    function resetUserModel() {
        selectedUserId.value = '';
        selectedUsername.value = '';
        selectedEmail.value = '';
        selectedPassword.value = '';
        selectedConfirmPassword.value = '';
    }
    function validateSelectedPassword(password: string) {
        //si sta facendo un update
        if (selectedUserId.value != '') {
            if (password == '' || Utilities.validatePassword(password))
                return true;
            return false;
        }
        //si sta facendo un'insert
        else {
            if (Utilities.validatePassword(password))
                return true;
            return false;
        }
    }
    function validateSelectedConfirmPassword(password: string, confirmPassword: string) {
        //si sta facendo un update
        if (selectedUserId.value != '') {
            if ((password == '' && confirmPassword == '')
                || (Utilities.validatePassword(password)
                    && Utilities.validatePassword(confirmPassword)
                    && password == confirmPassword))
                return true;
            return false;
        }
        //si sta facendo un'insert
        else {
            if (Utilities.validatePassword(password)
                && Utilities.validatePassword(confirmPassword)
                && password == confirmPassword)
                return true;
            return false;
        }
    }
    //</user modal>
    //<insert user>
    function insertUser() {
        if (selectedUsername.value != '' && Utilities.validateEmail(selectedEmail.value)
            && validateSelectedPassword(selectedPassword.value)
            && validateSelectedConfirmPassword(selectedPassword.value, selectedConfirmPassword.value)) {
            pageIsLoading.value = true;
            Admin.insertUser(selectedUsername.value, selectedEmail.value, selectedPassword.value, selectedConfirmPassword.value)
                .then((response: any) => {
                    message.success(t('ok'));
                })
                .catch((error: any) => {
                    message.error(t('error'));
                }).then(() => {
                    pageIsLoading.value = false;
                    closeUserModal();
                    getUsers();
                });
        }
    }
    //</insert user>
    //<update user>
    function updateUser() {
        if (selectedUsername.value != ''
            && Utilities.validateEmail(selectedEmail.value)
            && validateSelectedPassword(selectedPassword.value)
            && validateSelectedConfirmPassword(selectedPassword.value, selectedConfirmPassword.value)) {
            pageIsLoading.value = true;
            Admin.updateUser(selectedUserId.value, selectedUsername.value, selectedEmail.value, selectedPassword.value)
                .then((response: any) => {
                    message.success(t('ok'));
                })
                .catch((error: any) => {
                    message.error(t('error'));
                }).then(() => {
                    pageIsLoading.value = false;
                    closeUserModal();
                    getUsers();
                });
        }
    }
    //</update user>
    //<delete user>
    function deleteUser(userId: string) {
        if (userId) {
            dialog.error({
                showIcon: false,
                closable: false,
                title: t('deleteUser'),
                content: t('areYouSure'),
                positiveText: t('ok'),
                negativeText: t('cancel'),
                //positiveButtonProps: {
                //    color: 'red'
                //},
                onPositiveClick: () => {
                    pageIsLoading.value = true;
                    Admin.deleteUser(userId)
                        .then((response: any) => {
                            message.success(t('ok'));
                        })
                        .catch((error: any) => {
                            message.error(t('error'));
                        }).then(() => {
                            pageIsLoading.value = false;
                            getUsers();
                        });
                },
                onNegativeClick: () => {

                },
                onClose: () => {
                }
            });
        }
    }
    //</delete user>

    //<add claim>
    function openAddCustomClaimModal(userId: any) {
        resetAddCustomClaimModal();
        if (userId) {
            selectedUserId.value = userId;
            claimsModalIsVisible.value = true;
        }
    }
    function closeAddCustomClaimModal() {
        claimsModalIsVisible.value = false;
        resetAddCustomClaimModal();
    }
    function addClaimToUser(userId: string, claimType: string, claimValue: string, callback: any) {
        pageIsLoading.value = true;
        Admin.addClaimToUser(userId, claimType, claimValue)
            .then((response: any) => {
                message.success(t('ok'));
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
                if (callback)
                    callback();
            });
    }
    function addCustomClaimToUser() {
        if (selectedUserId.value != '' && selectedClaimType.value != '' && selectedClaimValue.value != '') {
            addClaimToUser(selectedUserId.value, selectedClaimType.value, selectedClaimValue.value,
                () => {
                    closeAddCustomClaimModal();
                    getUsers();
                });
        }
    }
    function resetAddCustomClaimModal() {
        selectedUserId.value = '';
        selectedClaimType.value = ''
        selectedClaimValue.value = '';
    }
    //</add claim>

    //<remove claim>
    function removeClaimFromUser(userId: string, claimType: string, claimValue: string, callback: any) {
        if (userId != '' && claimType != '' && claimValue != '') {
            dialog.error({
                showIcon: false,
                closable: false,
                title: t('removeClaim'),
                content: t('areYouSure'),
                positiveText: t('ok'),
                negativeText: t('cancel'),
                //positiveButtonProps: {
                //    color: 'red'
                //},
                onPositiveClick: () => {
                    pageIsLoading.value = true;
                    Admin.removeClaimFromUser(userId, claimType, claimValue)
                        .then((response: any) => {
                            message.success(t('ok'));
                        })
                        .catch((error: any) => {
                            message.error(t('error'));
                        }).then(() => {
                            pageIsLoading.value = false;
                            if (callback)
                                callback();
                        });
                },
                onNegativeClick: () => {
                },
                onClose: () => {
                }
            });
        }
    }
    //</remove claim>

    //<existing claims>
    function openExistingClaimsModal(userId: any) {
        if (userId) {
            selectedUserId.value = userId;
            existingClaimsFilter.value = '';
            existingClaimsModalIsVisible.value = true;
            getExistingClaims(userId);
        }
    }
    function closeExistingClaimsModal() {
        existingClaimsModalIsVisible.value = false;
        selectedUserId.value = '';
    }
    function getExistingClaims(userId: string) {
        pageIsLoading.value = true;
        Admin.getAvailableClaimsForUser(userId)
            .then((response: any) => {
                existingClaims.value = response.data.result;
                existingClaimsFiltered.value = response.data.result;
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }
    function searchExistingClaims(event: string) {
        existingClaimsFiltered.value = existingClaims.value.filter((item: any) => {
            return (item.claim.claimType.toLowerCase().indexOf(existingClaimsFilter.value.toLowerCase()) !== -1 ||
                item.claim.claimValue.toLowerCase().indexOf(existingClaimsFilter.value.toLowerCase()) !== -1);
        });
    }
    function addExistingClaimToUser(claimType: string, claimValue: string) {
        pageIsLoading.value = true;
        addClaimToUser(selectedUserId.value, claimType, claimValue,
            () => {
                getExistingClaims(selectedUserId.value);
                getUsers();
            });
    }
    function removeExistingClaimFromUser(claimType: string, claimValue: string) {
        removeClaimFromUser(selectedUserId.value, claimType, claimValue, () => { getExistingClaims(selectedUserId.value); getUsers(); });
    }
    //</existing claims>

    //<remove role>
    function removeRoleFromUser(userId: string, roleName: string, callback: any) {
        if (userId != '' && roleName != '') {
            dialog.error({
                showIcon: false,
                closable: false,
                title: t('removeRole'),
                content: t('areYouSure'),
                positiveText: t('ok'),
                negativeText: t('cancel'),
                //positiveButtonProps: {
                //    color: 'red'
                //},
                onPositiveClick: () => {
                    pageIsLoading.value = true;
                    Admin.removeRoleFromUser(userId, roleName)
                        .then((response: any) => {
                            message.success(t('ok'));
                        })
                        .catch((error: any) => {
                            message.error(t('error'));
                        }).then(() => {
                            pageIsLoading.value = false;
                            if (callback)
                                callback();
                        });
                },
                onNegativeClick: () => {
                },
                onClose: () => {
                }
            });
        }
    }
    //</remove role>

    //<existing roles>
    function openExistingRolesModal(userId: string) {
        selectedUserId.value = userId;
        existingRolesModalIsVisible.value = true;
        getExistingRoles(userId);
        existingRolesFilter.value = ''
    }
    function closeExistingRolesModal() {
        existingRolesModalIsVisible.value = false;
        existingRolesFilter.value = ''
        selectedUserId.value = '';
    }
    function getExistingRoles(userId: string) {
        pageIsLoading.value = true;
        Admin.getAvailableRolesForUser(userId)
            .then((response: any) => {
                existingRoles.value = response.data.result;
                existingRolesFiltered.value = response.data.result;
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }
    function searchExistingRoles(event: string) {
        existingRolesFiltered.value = existingRoles.value.filter((item: any) => {
            return (item.role.name.toLowerCase().indexOf(existingRolesFilter.value.toLowerCase()) !== -1 ||
                item.role.name.toLowerCase().indexOf(existingRolesFilter.value.toLowerCase()) !== -1);
        });
    }
    function addExistingRoleToUser(roleName: string, callback: any) {
        pageIsLoading.value = true;
        Admin.addRoleToUser(selectedUserId.value, roleName)
            .then((response: any) => {
                message.success(t('ok'));
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
                if (callback)
                    callback();
            });
    }
    function removeExistingRoleFromUser(roleName: string, callback: any) {
        removeRoleFromUser(selectedUserId.value, roleName, callback);
    }
    //</existing roles>
</script>