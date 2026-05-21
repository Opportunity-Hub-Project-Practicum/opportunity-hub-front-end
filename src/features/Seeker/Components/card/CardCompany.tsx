interface Organization {
    year_establishment?: number;
    organization_type?: string;
    team_size?: string;
    company_email?: string;
    Category?: string;
    value?: string;
    image: string;
    name: string;
    industry_type: string;
}
export default function CardCompany({ organization }: { organization?: Organization }) {
    return (
        <div className='border rounded-lg border-primary p-5 flex flex-col gap-5'>
            {/* Company Header */}
            <div className='flex gap-3 items-start'>
                <img
                    className='w-12 h-12 rounded-lg'
                    src={organization?.image}
                    alt={organization?.name}
                />
                <div className='flex flex-col'>
                    <span className='font-semibold text-sm'>{organization?.name}</span>
                    <span className='text-xs text-gray-500'>{organization?.industry_type}</span>
                </div>
            </div>
            <div className='flex flex-col gap-3 text-sm'>
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Founded in</span>
                    <span className='font-semibold'>{organization?.year_establishment}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Organization Type</span>
                    <span className='font-semibold'>{organization?.organization_type}</span>
                </div>
                {organization?.team_size && (
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Company Size</span>
                        <span className='font-semibold'>{organization?.team_size}</span>
                    </div>
                )}
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Email</span>
                    <span className='font-semibold'>{organization?.company_email}</span>
                </div>
                {organization?.Category === 'phone' && (
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Phone</span>
                        <span className='font-semibold'>{organization?.value}</span>
                    </div>
                )}
                {organization?.Category === 'web_url' && (
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Website</span>
                        <span className='font-semibold'>{organization?.value}</span>
                    </div>
                )}
            </div>
        </div>
    );
}