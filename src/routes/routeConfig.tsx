//impot layout
import HomeLayout from "../Layouts/HomeLayout";
import SeekerLayout from "../Layouts/SeekerLayout";
//pages for seeker
import SignUpSeeker from "../features/Seeker/Pages/SignUpSeeker";
import LogInSeeker from "../features/Seeker/Pages/LoginSeeker";
import PostList from "../features/Seeker/Pages/PostList";
import HomeSeeker from "../features/Seeker/Pages/HomeSeeker";
import PostDetail from "../features/Seeker/Pages/PostDetail";
import OrganizationList from "../features/Seeker/Pages/OrganizationList";
import OrganizationDetail from "../features/Seeker/Pages/OrganizationDetail";
import OverviewActivity from "../features/Seeker/Pages/OverviewActivity";
import Applied from "../features/Seeker/Pages/Applied";
import Favorite from "../features/Seeker/Pages/Favorite";
import Alert from "../features/Seeker/Pages/Alert";
import Setting from "../features/Seeker/Pages/Setting";
export interface RouteConfig {
    path?: string;
    label: string;
    role?: 'admin' | 'employer' | 'seeker';
    loader?: any;
    component?: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
    children?: RouteConfig[];
}

export const routeConfig: RouteConfig[] = [
    {

        path: '/signUpSeeker',
        label: 'SignUpSeeker',
        layout: SignUpSeeker,
    },
    {
        path: '/logInSeeker',
        label: 'LogInSeeker',
        layout: LogInSeeker,
    },

    {
        label: 'HomeLayout',
        layout: HomeLayout,
        children: [
            {
                path: '/',
                label: 'Home',
                component: HomeSeeker,
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
    {
        label: 'SeekerLayout',
        layout: SeekerLayout,
        //role:'seeker',
        children: [
            {
                path: '/overviewActivity',
                label: 'OverviewActivity',
                component: OverviewActivity
            },
            {
                path: '/applied',
                label: 'Applied',
                component: Applied
            }, {
                path: '/favorite',
                label: 'Favorite',
                component: Favorite
            }, {
                path: '/alert',
                label: 'Alert',
                component: Alert
            }, {
                path: '/setting',
                label: 'Setting',
                component: Setting
            },
        ]
    }

]