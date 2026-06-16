import { ROUTES } from "./path";
//impot layout
import HomeLayout from "../Layouts/HomeLayout";
import SeekerLayout from "../Layouts/SeekerLayout";
import EmployerLayout from "../Layouts/EmployerLayout";
import AdminLayout from "../Layouts/AdminLayout";
import { Navigate } from "react-router-dom";
//pages for seeker
import SignUpSeeker from "../features/Auth/SignUpPage";
import LoginPage from "../features/Auth/LoginPage";
import PostList from "../features/Seeker/Pages/PostListPage";
import HomeSeeker from "../features/Seeker/Pages/HomeSeekerPage";
import PostDetail from "../features/Seeker/Pages/PostDetailPage";
import OrganizationList from "../features/Seeker/Pages/OrganizationListPage";
import OrganizationDetail from "../features/Seeker/Pages/OrganizationDetailPage";
import OverviewActivity from "../features/Seeker/Pages/OverviewActivityPage";
import Applied from "../features/Seeker/Pages/AppliedPage";
import Favorite from "../features/Seeker/Pages/FavoritePage";
import Alert from "../features/Seeker/Pages/AlertPage";
import Setting from "../features/Seeker/Pages/SettingPage";
// import for employer
import SignUpPage from "../features/Auth/SignUpEmployerPage";
import HomeEmployerPage from "../features/Employer/Pages/HomeEmployer";
import MyJobPage from "../features/Employer/Pages/MyJobPage";
import OverviewPage from "../features/Employer/Pages/OverviewPage";
import PostApplicationPage from "../features/Employer/Pages/PostApplicationPage";
import SaveCandidatePage from "../features/Employer/Pages/SaveCandidatePage";
import SaveCandidateDetailPage from "../features/Employer/Pages/SaveCandidateDetailPage";
import SettingPage from "../features/Employer/Pages/SettingPage";
import MyJobViewApplicationPage from "../features/Employer/Pages/MyJobViewApplicationPage";
//import for admin

import OverviewPageAdmin from "../features/Admin/Pages/OverviewPage";
import AllEmployerPage from "../features/Admin/Pages/AllEmployerPage";
import AllPostPage from "../features/Admin/Pages/AllPostPage";
import ManageUserPage from "../features/Admin/Pages/ManageUserPage";
import ProfilePage from "../features/Admin/Pages/ProfilePage";
import ReportedPage from "../features/Admin/Pages/ReportedPage";
import ReportedPostDetailPage from "../features/Admin/Pages/ReportedPostDetailPage";
import { createRoleLoader } from "./loaders";
export interface RouteConfig {
    path?: string;
    label?: string;
    role?: 'admin' | 'employer' | 'seeker';
    loader?: any;
    component?: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
    children?: RouteConfig[];
}

export const routeConfig: RouteConfig[] = [
    {

        path: ROUTES.AUTH.SIGNUP_SEEKER,
        label: 'SignUpSeeker',
        layout: SignUpSeeker,
    },
    {
        path: ROUTES.AUTH.LOGIN,
        label: 'LoginPage',
        layout: LoginPage,
    },

    {
        path: ROUTES.AUTH.SIGNUP_EMPLOYER,
        label: 'SignUpEmployer',
        component: SignUpPage
    },

    {
        label: 'HomeLayout',
        layout: HomeLayout,
        children: [

            {
                path: ROUTES.HOME.ROOT,
                label: 'Home',
                component: HomeSeeker,
            },


            {
                path: ROUTES.HOME.ORGANIZATION_LIST,
                label: 'OrganizationList',
                component: OrganizationList
            },
            {
                path: ROUTES.HOME.POST_LIST,
                label: 'Postlist',
                component: PostList,
            },
            {
                path: ROUTES.HOME.HOME_EMPLOYER,
                label: 'homeEmployer',
                component: HomeEmployerPage,
            },
            {
                path: ROUTES.HOME.POST_DETAIL_ROUTE,
                label: 'PostDetail',
                component: PostDetail
            },
            {
                path: ROUTES.HOME.ORGANIZATION_DETAIL(':id'),
                label: 'OrganizationDetail',
                component: OrganizationDetail
            },
        ]
    },
    {
        label: 'SeekerLayout',
        layout: SeekerLayout,
        path: ROUTES.SEEKER.ROOT,
        loader: createRoleLoader('seeker'),
        children: [

            {
                path: ROUTES.SEEKER.OVERVIEW,
                label: 'OverviewActivity',
                component: OverviewActivity
            },
            {
                path: ROUTES.SEEKER.APPLIED,
                label: 'Applied',
                component: Applied
            }, {
                path: ROUTES.SEEKER.FAVORITE,
                label: 'Favorite',
                component: Favorite
            }, {
                path: ROUTES.SEEKER.ALERT,
                label: 'Alert',
                component: Alert
            }, {
                path: ROUTES.SEEKER.SETTING,
                label: 'Setting',
                component: Setting
            },
        ]
    }
    ,
    {
        label: 'EmployerLayout',
        path: ROUTES.EMPLOYER.ROOT,
        layout: EmployerLayout,
        loader: createRoleLoader('employer'),
        children: [

            {
                path: '',
                label: 'IndexRedirect',
                component: () => <Navigate to={ROUTES.EMPLOYER.OVERVIEW} replace />
            },

            {
                path: ROUTES.EMPLOYER.MY_JOBS,
                label: 'MyJob',
                component: MyJobPage
            },
            {
                path: ROUTES.EMPLOYER.OVERVIEW,
                label: 'Overview',
                component: OverviewPage
            },
            {
                path: ROUTES.EMPLOYER.POST_APPLICATION,
                label: 'PostApplication',
                component: PostApplicationPage
            },
            {
                path: ROUTES.EMPLOYER.SAVE_CANDIDATE_DETAIL_ROUTE,
                label: 'SaveCandidateDetail',
                component: SaveCandidateDetailPage
            },
            {
                path: ROUTES.EMPLOYER.SAVE_CANDIDATE,
                label: 'SaveCandidate',
                component: SaveCandidatePage
            },
            {
                path: ROUTES.EMPLOYER.SETTING,
                label: 'SettingEmployer',
                component: SettingPage
            },
            {
                path: ROUTES.EMPLOYER.MY_JOB_VIEW_APPLICATION_ROUTE,
                label: 'MyJobViewApplication',
                component: MyJobViewApplicationPage
            }
        ]
    },

    {
        label: 'adminLayout',
        path: ROUTES.ADMIN.ROOT,
        layout: AdminLayout,
        loader: createRoleLoader('admin'),
        children: [
            {
                path: '',
                label: 'IndexRedirect',
                component: () => <Navigate to={ROUTES.ADMIN.OVERVIEW} replace />
            },
            {
                path: ROUTES.ADMIN.OVERVIEW,
                component: OverviewPageAdmin,
            },
            {
                path: ROUTES.ADMIN.ALL_EMPLOYER,
                component: AllEmployerPage,
            },
            {
                path: ROUTES.ADMIN.ALL_POST,
                component: AllPostPage,
            }, {
                path: ROUTES.ADMIN.MANAGE_USER,
                component: ManageUserPage,
            }, {
                path: ROUTES.ADMIN.PROFILE,
                component: ProfilePage,

            }, {
                path: ROUTES.ADMIN.REPORTED,
                component: ReportedPage,
            }, {
                path: ROUTES.ADMIN.REPORTED_DETAIL_ROUTE,
                component: ReportedPostDetailPage,
            },
        ]
    }

]