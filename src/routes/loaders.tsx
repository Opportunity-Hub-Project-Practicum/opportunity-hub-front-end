import { redirect } from "react-router-dom";


interface LoaderContext {
    userRole: string | null;
}

export const createRoleLoader = (requireRole: 'admin' | 'employer' | 'seeker') => {
    return async ({ params }: any, context?: LoaderContext) => {

        // check the auth context will implement later
        const userRole = context?.userRole;

        if (!userRole) {
            return redirect('/');
        }
        if (userRole != requireRole) {
            return redirect('/')
        }
        // success user have right role 
        return null;

    }
}