import SignUpSeeker from "../features/Seeker/Pages/SignUpSeeker";
import LogInSeeker from "../features/Seeker/Pages/LoginSeeker";
import HomeLayout from "../Layouts/HomeLayout";
import PostList from "../features/Seeker/Pages/PostList";
import HomeSeeker from "../features/Seeker/Pages/HomeSeeker";
import PostDetail from "../features/Seeker/Pages/PostDetail";
import OrganizationList from "../features/Seeker/Pages/OrganizationList";
import OrganizationDetail from "../features/Seeker/Pages/OrganizationDetail";
export interface RouteConfig {
    path?: string;
    label: string;
    role?: 'admin' | 'employer' | 'seeker';
    loader?: any;
    component?: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
    children?: RouteConfig[];  // 👈 add this line
}

export const routeConfig: RouteConfig[] = [

    {
        label: 'HomeLayout',
        layout: HomeLayout,        // 👈 one layout for all children below
        children: [
            {
                path: '/',
                label: 'Home',
                component: HomeSeeker,
            },
            {
                path: '/signUpSeeker',
                label: 'SignUpSeeker',
                component: SignUpSeeker,
            },
            {
                path: '/logInSeeker',
                label: 'LogInSeeker',
                component: LogInSeeker,
            },
            {
                path: '/organizationList',
                label: 'OrganizationList',
                component: OrganizationList
            },
            {
                path: '/postList',
                label: 'Postlist',
                component: PostList,
            },
            {
                path: '/postDetail/:id',
                label: 'PostDetail',
                component: PostDetail
            },
            {
                path: '/organizationDetail/:id',
                label: 'OrganizationDetail',
                component: OrganizationDetail
            },
        ]
    },

]