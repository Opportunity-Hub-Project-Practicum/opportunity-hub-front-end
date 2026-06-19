import { useState } from "react"
import OrganizationForm from "../../GlobalComponents/OrganizationForm"
import type { EmployerData } from "../../GlobalComponents/OrganizationForm"
import { ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../routes/path"
import { useAuth } from "../../contexts/AuthContext"
import { buildEmployerRegisterPayload } from "../Employer/lib/buildEmployerRegisterPayload"
import { uploadLogoIfNeeded } from "../Employer/lib/employerProfileSave"
import { updateEmployerProfile } from "../Employer/services/employerProfileService"
import { getHomeRouteForRole } from "./lib/authRoutes"
import { formatApiError } from "../../services/apiClient"
import { useLookupValues } from "../../hooks/useLookupValues"

function validateEmployerForm(data: EmployerData): string | null {
    if (!data.fullName.trim()) {
        return "Please enter your full name."
    }

    if (!data.email.trim()) {
        return "Please enter your email."
    }

    if (!data.companyName.trim() || !data.phoneNumber.trim()) {
        return "Please complete required company fields."
    }

    if (data.password.length < 8) {
        return "Password must be at least 8 characters."
    }

    if (data.password !== data.confirmPassword) {
        return "Passwords do not match."
    }

    return null
}

export default function SignUpEmployerPage() {
    const navigate = useNavigate()
    const { registerEmployer } = useAuth()
    const { lookupValues } = useLookupValues()
    const [employerData, setEmployerData] = useState<EmployerData>()
    const [companyInfoTab, setCompanyInfoTab] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSave = async () => {
        if (!employerData) {
            setError("Please complete the company profile.")
            return
        }

        const validationError = validateEmployerForm(employerData)
        if (validationError) {
            setError(validationError)
            if (!employerData.fullName.trim() || !employerData.email.trim() || !employerData.password) {
                setCompanyInfoTab(true)
            }
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const user = await registerEmployer(buildEmployerRegisterPayload(employerData, lookupValues))

            const uploadedLogoPath = await uploadLogoIfNeeded(employerData)
            if (uploadedLogoPath) {
                await updateEmployerProfile({ logo_img: uploadedLogoPath })
            }

            navigate(getHomeRouteForRole(user.role), { replace: true })
        } catch (err) {
            setError(formatApiError(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="page-container">
            <h1 className="flex w-full text-primary font-bold text-big justify-start items-start">
                <Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link>
            </h1>
            <hr className="text-gray-200 my-3 w-full" />

            <p className="text-sm text-slate-600 mb-4">
                Create your employer account with your company details.
            </p>

            {error && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            <OrganizationForm
                onChange={(data) => setEmployerData(data)}
                companyInfoTab={companyInfoTab}
                onTabChange={setCompanyInfoTab}
            />

            {companyInfoTab && (
                <div className=" flex justify-end pr-45">
                    <button
                        type="button"
                        onClick={() => setCompanyInfoTab(false)}
                        className="flex gap-1 w-fit btn-primary-blue"
                    >
                        Next <ArrowRight />
                    </button>
                </div>
            )}

            {!companyInfoTab && (
                <div className=" flex justify-end pr-45 gap-5">
                    <button
                        type="button"
                        onClick={() => setCompanyInfoTab(true)}
                        className="btn-primary-white"
                        disabled={isSubmitting}
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="btn-primary-blue disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating account..." : "Create employer account"}
                    </button>
                </div>
            )}
        </div>
    )
}
