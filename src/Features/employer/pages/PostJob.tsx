import { Layout } from "../component/Layout";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PostJob() {
  const [postingType, setPostingType] = useState<"job" | "volunteer">("job");

  const [formData, setFormData] = useState({
    jobTitle: "",
    tags: "",
    causeArea: "",
    timeCommitment: "",
    minSalary: "",
    maxSalary: "",
    salaryCurrency: "USD",
    salaryType: "Hourly",
    education: "",
    experience: "",
    jobType: "",
    vacancies: "",
    expirationDate: "",
    applyOn: "opportunity-hub",
    description: "",
    responsibilities: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, applyOn: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {postingType === "job" ? "Post a Job" : "Post a Volunteer Opportunity"}
          </h1>
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              type="button"
              onClick={() => setPostingType("job")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                postingType === "job"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Post a Job
            </button>
            <button
              type="button"
              onClick={() => setPostingType("volunteer")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                postingType === "volunteer"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Volunteer
            </button>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {postingType === "job" ? "Job Title" : "Volunteer Role Title"}
          </label>
          <input
            type="text"
            name="jobTitle"
            placeholder={
              postingType === "job"
                ? "Add job title, tools, keywords etc."
                : "Add role title, mission, impact keywords etc."
            }
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {postingType === "job" ? "Tags" : "Skills / Interests"}
          </label>
          <input
            type="text"
            name="tags"
            placeholder={
              postingType === "job"
                ? "Add keywords, tags etc..."
                : "Add causes, skills, interests etc..."
            }
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {postingType === "volunteer" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cause Area
              </label>
              <div className="relative">
                <select
                  name="causeArea"
                  value={formData.causeArea}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">Select...</option>
                  <option>Education</option>
                  <option>Environment</option>
                  <option>Healthcare</option>
                  <option>Community Support</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Commitment
              </label>
              <div className="relative">
                <select
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">Select...</option>
                  <option>2-4 hours/week</option>
                  <option>5-10 hours/week</option>
                  <option>10+ hours/week</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        )}

        {/* Salary Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {postingType === "job" ? "Salary" : "Stipend (Optional)"}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {postingType === "job" ? "Min Salary" : "Min Stipend"}
              </label>
              <input
                type="text"
                name="minSalary"
                placeholder={postingType === "job" ? "Minimum Salary" : "Minimum Stipend"}
                value={formData.minSalary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {postingType === "job" ? "Max Salary" : "Max Stipend"}
              </label>
              <input
                type="text"
                name="maxSalary"
                placeholder={postingType === "job" ? "Maximum Salary" : "Maximum Stipend"}
                value={formData.maxSalary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <div className="relative">
                <select
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {postingType === "job" ? "Salary Type" : "Compensation Type"}
            </label>
            <div className="relative">
              <select
                name="salaryType"
                value={formData.salaryType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {postingType === "job" ? (
                  <>
                    <option>Hourly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </>
                ) : (
                  <>
                    <option>Unpaid</option>
                    <option>Stipend</option>
                    <option>Travel Reimbursement</option>
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Advance Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {postingType === "job" ? "Advance Information" : "Opportunity Details"}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              <div className="relative">
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option>Select...</option>
                  <option>High School</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <div className="relative">
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option>Select...</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3+ years</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {postingType === "job" ? "Job Type" : "Volunteer Type"}
              </label>
              <div className="relative">
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option>Select...</option>
                  {postingType === "job" ? (
                    <>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Internship</option>
                      <option>Freelance</option>
                    </>
                  ) : (
                    <>
                      <option>On-site</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>Event-based</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vacancies
              </label>
              <div className="relative">
                <select
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option>Select...</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3+</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Apply Job On */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Apply On:
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="applyOn"
                value="opportunity-hub"
                checked={formData.applyOn === "opportunity-hub"}
                onChange={handleRadioChange}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">
                On OpportunityHub
              </span>
              <span className="text-gray-600 text-sm">
                Candidates apply directly on OpportunityHub
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="applyOn"
                value="external"
                checked={formData.applyOn === "external"}
                onChange={handleRadioChange}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">External URL</span>
              <span className="text-gray-600 text-sm">
                Candidates apply on a custom URL
              </span>
            </label>
          </div>
        </div>

        {/* Description & Responsibility */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {postingType === "job" ? "Description & Responsibility" : "Opportunity Description"}
          </h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Add your job description..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2 mt-2 text-gray-400 text-sm">
            <button type="button" className="hover:text-gray-600">
              B
            </button>
            <button type="button" className="hover:text-gray-600">
              I
            </button>
            <button type="button" className="hover:text-gray-600">
              U
            </button>
            <span className="mx-1">|</span>
            <button type="button" className="hover:text-gray-600">
              ◆
            </button>
            <button type="button" className="hover:text-gray-600">
              ○
            </button>
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsibilities
          </label>
          <textarea
            name="responsibilities"
            placeholder="Add your job responsibilities..."
            value={formData.responsibilities}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2 mt-2 text-gray-400 text-sm">
            <button type="button" className="hover:text-gray-600">
              B
            </button>
            <button type="button" className="hover:text-gray-600">
              I
            </button>
            <button type="button" className="hover:text-gray-600">
              U
            </button>
            <span className="mx-1">|</span>
            <button type="button" className="hover:text-gray-600">
              ◆
            </button>
            <button type="button" className="hover:text-gray-600">
              ○
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {postingType === "job" ? "Post Job" : "Post Volunteer"}
            <span>→</span>
          </button>
        </div>
      </form>
    </Layout>
  );
}
