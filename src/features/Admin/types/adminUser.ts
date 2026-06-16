import type { EmployerProfileApi } from "../../Employer/types/employerProfile";
import type { SeekerProfileApi } from "../../Seeker/types/seekerProfile";

export type ManageUserFilter = "user" | "organisation";

export type AdminSeekerApi = SeekerProfileApi & {
    is_ban: boolean;
    created_at: string;
    updated_at?: string;
};

export type AdminSeekersResponse = {
    seekers: AdminSeekerApi[];
};

export type AdminSeekerResponse = {
    seeker: AdminSeekerApi;
};

export type AdminEmployersResponse = {
    employers: EmployerProfileApi[];
};

export type AdminEmployerResponse = {
    employer: EmployerProfileApi;
};
