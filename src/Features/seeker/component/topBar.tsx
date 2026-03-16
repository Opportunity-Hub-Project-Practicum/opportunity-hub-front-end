import profile from "../../../assets/profile.png";

export default function TopBar() {
    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <a href="#" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                            Opportunity Hub
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-8 list-none">
                        <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Opportunities</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Find Employer</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">My Activity</a></li>
                    </ul>

                    {/* Profile */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <img 
                                src={profile} 
                                alt="profile" 
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}