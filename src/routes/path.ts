export const ROUTES = {
    AUTH: {
        SIGNUP_SEEKER: "/signUpSeeker",
        LOGIN: "/loginPage",
        SIGNUP_EMPLOYER: "/accountSetup",
        FORGOT_PASSWORD: "/forgot-password",
    },

    HOME: {
        ROOT: "/",
        HOME_EMPLOYER: "/HomeEmployer",
        ORGANIZATION_LIST: "/organizationList",
        POST_LIST: "/postList",
        POST_DETAIL_ROUTE: "/postDetail/:id",
        POST_DETAIL: (id: string|number) => `/postDetail/${id}`,
        ORGANIZATION_DETAIL: (id: string|number) => `/organizationDetail/${id}`,
    },

    SEEKER: {
        ROOT: "/seeker",
        OVERVIEW: "overviewActivity",
        APPLIED: "applied",
        FAVORITE: "favorite",
        ALERT: "alert",
        SETTING: "setting",
    },

    EMPLOYER: {
        ROOT: "/employer",
        OVERVIEW: "overview",
        MY_JOBS: "myJobs",
        POST_APPLICATION: "postApplication",
        SAVE_CANDIDATE: "saveCandidate",
        SAVE_CANDIDATE_DETAIL_ROUTE: "saveCandidate/:favouriteId",
        SAVE_CANDIDATE_DETAIL: (favouriteId: string | number) => `saveCandidate/${favouriteId}`,
        SETTING: "setting",
        MY_JOB_VIEW_APPLICATION_ROUTE: "myJobViewApplication/:postId",
        MY_JOB_VIEW_APPLICATION: (postId: string | number) => `myJobViewApplication/${postId}`,
        SEEKER_PROFILE_ROUTE: "seekerProfile/:seekerId",
        SEEKER_PROFILE: (seekerId: string | number) => `seekerProfile/${seekerId}`,
    },

    ADMIN: {
      ROOT: '/admin',
      OVERVIEW:'overview',
      ALL_POST:'allPost',
      MANAGE_USER:'manageUser',
      PROFILE:'profile',
      REPORTED:'reported',
      MANAGE_VALUES:'manageValues',
      REPORTED_DETAIL_ROUTE: 'reported/:postId',
      REPORTED_DETAIL: (postId: string | number, status?: 'pending' | 'resolved') => {
        const base = `/admin/reported/${postId}`;
        return status ? `${base}?status=${status}` : base;
      },
      REPORTED_USER_DETAIL_ROUTE: 'reported/user/:seekerId',
      REPORTED_USER_DETAIL: (seekerId: string | number, status?: 'pending' | 'resolved', type?: 'user') => {
        const base = `/admin/reported/user/${seekerId}`;
        const params = new URLSearchParams();
        if (status) {
          params.set('status', status);
        }
        if (type) {
          params.set('type', type);
        }
        const query = params.toString();
        return query ? `${base}?${query}` : base;
      },
    
       

    },
};