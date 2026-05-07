import { useState } from "react";
import CardList from "../Components/card/CardList";
export default function Favorite() {
    const [isJob, setIsJob] = useState('job');
    return (<div>
        <div className="text-gray-600 mb-5 bg-gray-100 rounded-lg flex gap-3 p-3">
            <button className={isJob === 'job' ? ` text-primary underline` : ``}
                onClick={() => setIsJob('job')}
            >Jobs</button>
            <button className={isJob === 'volunteer' ? ` text-primary underline` : ``}
                onClick={() => setIsJob('volunteer')}
            >Volunteers</button>
        </div>
        <div className="flex flex-col gap-2">
            <CardList
                id={1}
                organizationName="Goole"
                title="Senior Frontend Developer"
                engagementType="Full Time"
                location="San Francisco, CA"
                salary="$120k - $180k"
                remainingDays="3 days left"
                image="/images/company-logo.jpg"
            />  <CardList
                id={1}
                organizationName="Goole"
                title="Senior Frontend Developer"
                engagementType="Full Time"
                location="San Francisco, CA"
                salary="$120k - $180k"
                remainingDays="3 days left"
                image="/images/company-logo.jpg"
            />
        </div>
    </div>);
}