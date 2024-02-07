import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import constantValues from '@/common/constantValues';
import { Auth } from '@/auth/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/AboutView.vue')
        },
        {
            path: '/api',
            name: 'api',
            component: () => import('@/views/APIView.vue')
        },
        {
            path: '/auth/users',
            name: 'users',
            meta: {
                requiresAuth: true,
                requiredClaim: constantValues.authClaims.CANDOANYTHING
            },
            component: () => import('@/views/auth/UsersView.vue')
        },
        {
            path: '/auth/roles',
            name: 'roles',
            meta: {
                requiresAuth: true,
                requiredClaim: constantValues.authClaims.CANDOANYTHING
            },
            component: () => import('@/views/auth/RolesView.vue')
        }
    ]
});

router.beforeEach((to, from) => {
    var pathExists = to.matched.length > 0;
    if (pathExists) {
        if (to.meta.requiresAuth) {
            if (Auth.isLoggedIn()) {
                var requiredClaim = to.meta.requiredClaim;
                if (requiredClaim) {
                    var currentUserHasClaim = Auth.checkClaim(requiredClaim as string);
                    if (!currentUserHasClaim)
                        return {
                            path: from.path
                        };
                }
            }
            else
                return {
                    path: from.path
                };
        }
    }
    else
        return {
            path: '/'
        };
});

export default router;
