<template>
    <n-spin :show="pageIsLoading">
        <h1 class="text-center">{{$t('roles')}}</h1>
        <div class="rolesContainer">
            <n-grid cols="12 s:12 m:12 l:12 xl:12 2xl:12" responsive="screen">
                <n-grid-item span="12 s:6 m:4 l:4 xl:4 2xl:4">
                    <n-input-group>
                        <n-input :placeholder="$t('name')" v-model:value="roleNameFilter" />
                        <!--<n-button type="info" class="align-items-start">
                    <n-icon size="25">
                        <Search12Regular />
                    </n-icon>
                        </n-button>-->
                        <n-button type="info" strong v-on:click="getRoles()">
                            {{$t('search')}}
                        </n-button>
                        <n-button type="default" color="gray" strong v-on:click="clearSearchRoles()">
                            {{$t('clear')}}
                        </n-button>
                    </n-input-group>
                </n-grid-item>
            </n-grid>
            <br />
            <n-grid>
                <n-grid-item>
                    <n-button type="info" v-on:click="openRoleModal()">{{$t('addRole')}}</n-button>
                </n-grid-item>
            </n-grid>
            <div v-for="role in roles">
                <n-grid cols="24" responsive="screen" class="mt-3">
                    <n-grid-item span="12">
                        <h3 class="wordBreakText">
                            <n-button text type="info" v-on:click="deleteRole(role.id)">
                                <n-icon size="25" color="red">
                                    <Delete20Filled />
                                </n-icon>
                            </n-button>
                            <n-button text type="info">
                                <n-icon size="25" color="orange" v-on:click="openRoleModal(role)">
                                    <Edit20Filled />
                                </n-icon>
                            </n-button>
                            {{role.name}}
                        </h3>
                        <n-grid cols="12" responsive="screen">
                            <n-grid-item span="12">
                                {{$t('id')}}: {{role.id}}
                                <br />
                                {{$t('name')}}: {{role.name}}
                            </n-grid-item>
                        </n-grid>
                    </n-grid-item>
                    <n-grid-item span="12">
                        <h4>{{$t('claims')}}</h4>
                        <n-grid cols="12" responsive="screen" v-for="claim in role.roleClaims">
                            <n-grid-item span="12">
                                <n-button text type="info" v-on:click="removeClaimFromRole(role.id, claim.claimType, claim.claimValue, ()=>{getRoles();})">
                                    <n-icon size="20" color="red">
                                        <Delete20Filled />
                                    </n-icon>
                                </n-button>
                                {{claim.claimType}} {{claim.claimValue}}
                            </n-grid-item>
                        </n-grid>
                        <n-grid cols="12">
                            <n-grid-item span="12">
                                <n-button type="info" v-on:click="openAddCustomClaimModal(role.id)">{{$t('customClaim')}}</n-button>
                                <n-button type="info" v-on:click="openExistingClaimsModal(role.id)">{{$t('existingClaims')}}</n-button>
                            </n-grid-item>
                        </n-grid>
                    </n-grid-item>
                </n-grid>
                <hr />
            </div>
        </div>
        <!--role form-->
        <n-modal v-model:show="roleModalIsVisible" >
            <n-spin :show="pageIsLoading">
                <n-card style="max-width: 400px" size="small">
                    <template #header>
                        <div class="text-center">
                            {{addOrUpdateRole}}
                        </div>
                    </template>
                    <n-input :placeholder="$t('name')" v-model:value="selectedRoleName" :status="selectedRoleName == '' ? 'error': null" />
                    <template #footer>
                        <div class="text-end">
                            <n-button type="default" size="small" v-on:click="closeRoleModal()">
                                {{$t('cancel')}}
                            </n-button>
                            <n-button type="info" size="small" style="margin-left:12px" v-on:click="confirmRoleModal()">
                                {{$t('ok')}}
                            </n-button>
                        </div>
                    </template>
                </n-card>
            </n-spin>
        </n-modal>
        <!--/role form-->
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
                            <n-button type="info" size="small" style="margin-left:12px" v-on:click="addCustomClaimToRole()">
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
    </n-spin>
</template>

<style scoped lang="scss">
    @import "@/style/globalVariables.module.scss";

    .rolesContainer {
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

    const { t, locale } = useI18n();
    const dialog = useDialog();
    const message = useMessage();

    var pageIsLoading = ref(false);
    var roles = ref<any[]>([]);
    var roleNameFilter = ref('');

    //<roles>
    var roleModalIsVisible = ref(false);
    var addOrUpdateRole = ref('');
    var selectedRoleId = ref('');
    var selectedRoleName = ref('');
    //</roles>

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
                                        removeExistingClaimFromRole(item.claim.claimType, item.claim.claimValue);
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
                                        addExistingClaimToRole(item.claim.claimType, item.claim.claimValue);
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
                key: 'type',
                render: (item: any, index: any) => {
                    return item.claim.claimType;
                },
                sorter: (rowA: any, rowB: any) => {
                    return rowA.claim.claimType.toLowerCase().localeCompare(rowB.claim.claimType.toLowerCase());
                }
            },
            {
                title: t('value'),
                key: 'value',
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

    onMounted(() => {
        getRoles();
    });

    //<get roles>
    function getRoles() {
        pageIsLoading.value = true;
        Admin.getRoles(roleNameFilter.value)
            .then((response: any) => {
                roles.value = response.data;
            })
            .catch((error: any) => {
                message.error(t('error'));
            }).then(() => {
                pageIsLoading.value = false;
            });
    }
    function clearSearchRoles() {
        roleNameFilter.value = '';
        getRoles();
    }
    //</get roles>

    //<role modal>
    function openRoleModal(role?: any) {
        if (role) {
            addOrUpdateRole.value = t('updateRole');
            selectedRoleId.value = role.id;
            selectedRoleName.value = role.name;
        }
        else {
            addOrUpdateRole.value = t('addRole');
            selectedRoleId.value = '';
            selectedRoleName.value = '';
        }
        roleModalIsVisible.value = true;
    }
    function closeRoleModal() {
        roleModalIsVisible.value = false;
        resetRoleModel();
    }
    function confirmRoleModal() {
        if (selectedRoleId.value != '')
            updateRole();
        else
            insertRole();
    }
    function resetRoleModel() {
        selectedRoleId.value = '';
        selectedRoleName.value = '';
    }
    //</role modal>

    //<insert role>
    function insertRole() {
        if (selectedRoleName.value != '') {
            pageIsLoading.value = true;
            Admin.insertRole(selectedRoleName.value)
                .then((response: any) => {
                    message.success(t('ok'));
                })
                .catch((error: any) => {
                    message.error(t('error'));
                }).then(() => {
                    pageIsLoading.value = false;
                    closeRoleModal();
                    getRoles();
                });
        }
    }
    //</insert role>

    //<update role>
    function updateRole() {
        if (selectedRoleId.value != '' && selectedRoleName.value != '') {
            pageIsLoading.value = true;
            Admin.updateRole(selectedRoleId.value, selectedRoleName.value)
                .then((response: any) => {
                    message.success(t('ok'));
                })
                .catch((error: any) => {
                    message.error(t('error'));
                }).then(() => {
                    pageIsLoading.value = false;
                    closeRoleModal();
                    getRoles();
                });
        }
    }
    //</update role>

    //<delete role>
    function deleteRole(roleId: string) {
        if (roleId) {
            dialog.error({
                showIcon: false,
                closable: false,
                title: t('deleteRole'),
                content: t('areYouSure'),
                positiveText: t('ok'),
                negativeText: t('cancel'),
                //positiveButtonProps: {
                //    color: 'red'
                //},
                onPositiveClick: () => {
                    pageIsLoading.value = true;
                    Admin.deleteRole(roleId)
                        .then((response: any) => {
                            message.success(t('ok'));
                        })
                        .catch((error: any) => {
                            message.error(t('error'));
                        }).then(() => {
                            pageIsLoading.value = false;
                            getRoles();
                        });
                },
                onNegativeClick: () => {

                },
                onClose: () => {
                }
            });
        }
    }
    //</delete role>

    //<add claim>
    function openAddCustomClaimModal(roleId: any) {
        resetAddCustomClaimModal();
        if (roleId) {
            selectedRoleId.value = roleId;
            claimsModalIsVisible.value = true;
        }
    }
    function closeAddCustomClaimModal() {
        claimsModalIsVisible.value = false;
        resetAddCustomClaimModal();
    }
    function addClaimToRole(roleId: string, claimType: string, claimValue: string, callback: any) {
        pageIsLoading.value = true;
        Admin.addClaimToRole(roleId, claimType, claimValue)
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
    function addCustomClaimToRole() {
        if (selectedRoleId.value != '' && selectedClaimType.value != '' && selectedClaimValue.value != '') {
            addClaimToRole(selectedRoleId.value, selectedClaimType.value, selectedClaimValue.value,
                () => {
                    closeAddCustomClaimModal();
                    getRoles();
                });
        }
    }
    function resetAddCustomClaimModal() {
        selectedRoleId.value = '';
        selectedClaimType.value = ''
        selectedClaimValue.value = '';
    }
    //</add claim>

    //<remove claim>
    function removeClaimFromRole(roleId: string, claimType: string, claimValue: string, callback: any) {
        if (roleId != '' && claimType != '' && claimValue != '') {
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
                    Admin.removeClaimFromRole(roleId, claimType, claimValue)
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
    function openExistingClaimsModal(roleId: any) {
        if (roleId) {
            selectedRoleId.value = roleId;
            existingClaimsFilter.value = '';
            existingClaimsModalIsVisible.value = true;
            getExistingClaims(roleId);
        }
    }
    function closeExistingClaimsModal() {
        existingClaimsModalIsVisible.value = false;
        selectedRoleId.value = '';
    }
    function getExistingClaims(roleId: string) {
        pageIsLoading.value = true;
        Admin.getAvailableClaimsForRole(roleId)
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
    function addExistingClaimToRole(claimType: string, claimValue: string) {
        pageIsLoading.value = true;
        addClaimToRole(selectedRoleId.value, claimType, claimValue,
            () => {
                getExistingClaims(selectedRoleId.value);
                getRoles();
            });
    }
    function removeExistingClaimFromRole(claimType: string, claimValue: string) {
        removeClaimFromRole(selectedRoleId.value, claimType, claimValue, () => { getRoles(); getExistingClaims(selectedRoleId.value); });
    }
    //</existing claims>
</script>