import { useState } from "react"
import OrganizationForm from "../../GlobalComponents/OrganizationForm"
import type { EmployerData } from "../../GlobalComponents/OrganizationForm"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../routes/path"
export default function SignUpEmployerPage() {
    const navigate = useNavigate()
    const [employerData, setEmployerData] = useState<EmployerData>()
    const [companyInfoTab, setCompanyInfoTab] = useState(true)

    const handleSave = () => {
        console.log(employerData);
        navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.OVERVIEW}`)
    }
    return (
        <div className="page-container">
            <h1 className="flex w-full text-primary font-bold text-big justify-start items-start">
                Opportunity Hub
            </h1>
            <hr className="text-gray-200 my-3 w-full" />
            <OrganizationForm
                onChange={(data) => setEmployerData(data)}
                companyInfoTab={companyInfoTab}
                onTabChange={setCompanyInfoTab}
            />
            {companyInfoTab && (

                <div className=" flex justify-end pr-45">
                    <button
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
                        onClick={() => setCompanyInfoTab(true)}
                        className="btn-primary-white"
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleSave}
                        className="btn-primary-blue"
                    >
                        Finish
                    </button>
                </div>
            )}

        </div>
    )
}