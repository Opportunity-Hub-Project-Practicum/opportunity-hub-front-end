import React, { useState, type ChangeEvent } from 'react';
import { ChevronDown, CheckCircle, AlertCircle, X } from 'lucide-react';

interface WorkExperienceData {
  jobTitle: string;
  jobRole: string;
  yearsOfExperience: string;
  company: string;
  industry: string;
  country: string;
  from: string;
  to: string;
  jobDescription: string;
}

type FormErrors = Partial<Record<keyof WorkExperienceData, string>>;

const EMPTY_FORM: WorkExperienceData = {
  jobTitle: '',
  jobRole: '',
  yearsOfExperience: '',
  company: '',
  industry: '',
  country: '',
  from: '',
  to: '',
  jobDescription: '',
};

const REQUIRED_FIELDS: (keyof WorkExperienceData)[] = ['jobTitle', 'jobRole', 'company'];

//const JOB_ROLES = ['Developer', 'Designer', 'Manager', 'Analyst', 'Marketing', 'Sales', 'Operations', 'Other'];
const YEARS_OF_EXPERIENCE = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'];
//const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Other'];
//const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Singapore', 'Other'];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i));

function validate(data: WorkExperienceData): FormErrors {
  const errors: FormErrors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!data[field].trim()) {
      errors[field] = 'This field is required';
    }
  }
  if (data.from && data.to && data.to !== 'Present' && Number(data.to) < Number(data.from)) {
    errors.to = '"To" year cannot be before "From" year';
  }
  return errors;
}

const SelectField: React.FC<{
  label: string;
  name: keyof WorkExperienceData;
  value: string;
  options: string[];
  error?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  extraOption?: { value: string; label: string };
}> = ({ label, name, value, options, error, onChange, extraOption }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
          }`}
      >
        <option value="">Select…</option>
        {extraOption && (
          <option value={extraOption.value}>{extraOption.label}</option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
        aria-hidden
      />
    </div>
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} aria-hidden /> {error}
      </p>
    )}
  </div>
);

const InputField: React.FC<{
  label: string;
  name: keyof WorkExperienceData;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, value, error, placeholder, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
        }`}
    />
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} aria-hidden /> {error}
      </p>
    )}
  </div>
);

const WorkExperienceForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<WorkExperienceData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof WorkExperienceData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: send formData to API or parent component
    console.log('Submitted Work Experience:', formData);
    setSubmitted(true);
    setFormData(EMPTY_FORM);
    setErrors({});
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    onClose?.();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg ">
      <div className="flex items-center justify-between  pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Education</h2>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {submitted && (
        <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          <CheckCircle size={16} aria-hidden />
          Experience added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Job title"
            name="jobTitle"
            value={formData.jobTitle}
            error={errors.jobTitle}
            placeholder="e.g. Senior Engineer"
            onChange={handleChange}
          />

          <InputField
            label="Job role"
            name="jobRole"
            value={formData.jobRole}
            placeholder='e.g. Sale'
            error={errors.jobRole}
            onChange={handleChange}
          />

          <SelectField
            label="Years of experience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            options={YEARS_OF_EXPERIENCE}
            onChange={handleChange}
          />

          <InputField
            label="Company"
            name="company"
            value={formData.company}
            error={errors.company}
            placeholder="e.g. Acme Corp"
            onChange={handleChange}
          />

          <InputField
            label="Industry"
            name="industry"
            value={formData.industry}
            placeholder='e.g. Tech'
            onChange={handleChange}
          />

          <InputField
            label="Country"
            name="country"
            value={formData.country}
            placeholder='..Cambodia'
            onChange={handleChange}
          />

          <SelectField
            label="From"
            name="from"
            value={formData.from}
            options={YEARS}
            onChange={handleChange}
          />

          <SelectField
            label="To"
            name="to"
            value={formData.to}
            options={YEARS}
            error={errors.to}
            onChange={handleChange}
            extraOption={{ value: 'Present', label: 'Present' }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
            Job description
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your responsibilities and achievements…"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Add experience
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;