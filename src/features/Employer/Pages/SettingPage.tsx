import { useState } from "react"
import OrganizationForm from "../../../GlobalComponents/OrganizationForm"
import type { EmployerData } from "../../../GlobalComponents/OrganizationForm"

export default function SettingPage() {
    const [FormData, setFormData] = useState<EmployerData>()
    const handleSave = () => {
        console.log(FormData)

    }
    return (
        <div>
            <OrganizationForm initialData={FormData} onChange={(data) => setFormData(data)} />
            <div className="w-full flex justify-end pr-10 md:pr-20 mb-10">
                <button
                    onClick={handleSave}
                    className=" btn-primary-blue px-10">Save</button>
            </div>
        </div>
    )
}