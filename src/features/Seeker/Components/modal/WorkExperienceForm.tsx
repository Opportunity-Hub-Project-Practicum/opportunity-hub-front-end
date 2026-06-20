import React, { useState, type ChangeEvent } from 'react';
import { ChevronDown, CheckCircle, AlertCircle, X } from 'lucide-react';
import { getLookupOptions, useLookupValues } from '../../../../hooks/useLookupValues';
import { LOOKUP_TYPES } from '../../../../types/lookupValue';

interface WorkExperienceData {
  jobTitle: string;
  jobRole: string;
  yearsOfExperience: string;
  company: string;
  industry: string;
  location: string;
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
  location: '',
  from: '',
  to: '',
  jobDescription: '',
};

const REQUIRED_FIELDS: (keyof WorkExperienceData)[] = ['jobTitle', 'jobRole', 'company', 'industry', 'location'];

//const JOB_ROLES = ['Developer', 'Designer', 'Manager', 'Analyst', 'Marketing', 'Sales', 'Operations', 'Other'];
const YEARS_OF_EXPERIENCE = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'];
//const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Other'];
//const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Singapore', 'Other'];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i));

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

type MonthYearParts = {
  month: string;
  year: string;
  isPresent: boolean;
};

function parseMonthYear(value: string): MonthYearParts {
  if (!value || value === 'Present') {
    return { month: '', year: '', isPresent: value === 'Present' };
  }

  const monthYearMatch = value.match(/^(\d{1,2})\/(\d{4})$/);
  if (monthYearMatch) {
    return {
      month: monthYearMatch[1].padStart(2, '0'),
      year: monthYearMatch[2],
      isPresent: false,
    };
  }

  if (/^\d{4}$/.test(value)) {
    return { month: '', year: value, isPresent: false };
  }

  return { month: '', year: '', isPresent: false };
}

function formatMonthYear(month: string, year: string): string {
  if (!month || !year) {
    return year;
  }
  return `${month.padStart(2, '0')}/${year}`;
}

function compareMonthYear(from: string, to: string): number {
  const parse = (value: string) => {
    const parts = parseMonthYear(value);
    if (!parts.year) {
      return null;
    }
    const month = parts.month ? Number(parts.month) : 1;
    return Number(parts.year) * 100 + month;
  };

  const fromValue = parse(from);
  const toValue = parse(to);
  if (fromValue == null || toValue == null) {
    return 0;
  }
  return fromValue - toValue;
}

function validate(data: WorkExperienceData): FormErrors {
  const errors: FormErrors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!data[field].trim()) {
      errors[field] = 'This field is required';
    }
  }
  if (data.from && data.to && data.to !== 'Present' && compareMonthYear(data.from, data.to) > 0) {
    errors.to = '"To" date cannot be before "From" date';
  }
  return errors;
}

const SelectField: React.FC<{
  label: string;
  name: keyof WorkExperienceData;
  value: string;
  options: string[];
  error?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  extraOption?: { value: string; label: string };
}> = ({ label, name, value, options, error, disabled = false, onChange, extraOption }) => (
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
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
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

const LookupSelectField: React.FC<{
  label: string;
  name: keyof WorkExperienceData;
  value: string;
  options: { value: string; name: string }[];
  error?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, name, value, options, error, disabled = false, onChange }) => (
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
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
          }`}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
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

const MonthYearField: React.FC<{
  label: string;
  month: string;
  year: string;
  isPresent?: boolean;
  error?: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onPresentChange?: (isPresent: boolean) => void;
}> = ({ label, month, year, isPresent = false, error, onMonthChange, onYearChange, onPresentChange }) => (
  <div className="flex flex-col gap-1.5 md:col-span-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="grid grid-cols-2 gap-3">
      <div className="relative">
        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          disabled={isPresent}
          className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Month</option>
          {MONTHS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
          aria-hidden
        />
      </div>
      <div className="relative">
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          disabled={isPresent}
          className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Year</option>
          {YEARS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
          aria-hidden
        />
      </div>
    </div>
    {onPresentChange && (
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={isPresent}
          onChange={(e) => onPresentChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Present
      </label>
    )}
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

const WorkExperienceForm: React.FC<{ onClose?: () => void; onSave?: (data: WorkExperienceData) => void }> = ({ onClose, onSave }) => {
  const { lookupValues, loading: lookupLoading } = useLookupValues();
  const jobRoleOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobRole);
  const industryOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.industry);
  const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location);

  const [formData, setFormData] = useState<WorkExperienceData>(EMPTY_FORM);
  const [fromMonth, setFromMonth] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toMonth, setToMonth] = useState('');
  const [toYear, setToYear] = useState('');
  const [toPresent, setToPresent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof WorkExperienceData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const updateFromDate = (month: string, year: string) => {
    setFromMonth(month);
    setFromYear(year);
    setFormData((prev) => ({ ...prev, from: formatMonthYear(month, year) }));
    if (errors.from) {
      setErrors((prev) => ({ ...prev, from: undefined }));
    }
  };

  const updateToDate = (month: string, year: string, isPresent: boolean) => {
    setToMonth(month);
    setToYear(year);
    setToPresent(isPresent);
    setFormData((prev) => ({
      ...prev,
      to: isPresent ? 'Present' : formatMonthYear(month, year),
    }));
    if (errors.to) {
      setErrors((prev) => ({ ...prev, to: undefined }));
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: WorkExperienceData = {
      ...formData,
      from: formatMonthYear(fromMonth, fromYear),
      to: toPresent ? 'Present' : formatMonthYear(toMonth, toYear),
    };
    const newErrors = validate(payload);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave?.(payload);
    setSubmitted(true);
    setFormData(EMPTY_FORM);
    setFromMonth('');
    setFromYear('');
    setToMonth('');
    setToYear('');
    setToPresent(false);
    setErrors({});
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setFromMonth('');
    setFromYear('');
    setToMonth('');
    setToYear('');
    setToPresent(false);
    setErrors({});
    onClose?.();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg ">
      <div className="flex items-center justify-between  pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
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

          <LookupSelectField
            label="Job role"
            name="jobRole"
            value={formData.jobRole}
            options={jobRoleOptions}
            error={errors.jobRole}
            disabled={lookupLoading}
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

          <LookupSelectField
            label="Industry"
            name="industry"
            value={formData.industry}
            options={industryOptions}
            error={errors.industry}
            disabled={lookupLoading}
            onChange={handleChange}
          />

          <LookupSelectField
            label="Location"
            name="location"
            value={formData.location}
            options={locationOptions}
            error={errors.location}
            disabled={lookupLoading}
            onChange={handleChange}
          />

          <MonthYearField
            label="From"
            month={fromMonth}
            year={fromYear}
            onMonthChange={(month) => updateFromDate(month, fromYear)}
            onYearChange={(year) => updateFromDate(fromMonth, year)}
          />

          <MonthYearField
            label="To"
            month={toMonth}
            year={toYear}
            isPresent={toPresent}
            error={errors.to}
            onMonthChange={(month) => updateToDate(month, toYear, toPresent)}
            onYearChange={(year) => updateToDate(toMonth, year, toPresent)}
            onPresentChange={(isPresent) => updateToDate('', '', isPresent)}
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