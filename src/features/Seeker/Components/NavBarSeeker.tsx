
import { Link } from "react-router-dom";
export default function NavBarSeeker() {


    return (
        <nav className=" flex justify-between page-container ">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <h1 className="whitespace-nowrap text-big text-primary"><Link to='/'>Opportunity Hub</Link></h1>

                <ul className="flex gap-5">
                    <li className="whitespace-nowrap"><Link to='/postList'>Opportunities</Link></li>
                    <li className="whitespace-nowrap"><Link to='/organizationList'>Find Employer</Link></li>
                    <li className="whitespace-nowrap"><Link to='/overviewActivity'>My Activity</Link></li>
                </ul>

            </div>


            <button ><Link to='/setting'><img
                className='rounded-full h-10 w-10 border'
                src="" alt="" /></Link></button>
        </nav>
    );
}