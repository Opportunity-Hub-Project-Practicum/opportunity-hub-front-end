import React, { useState, type ChangeEvent } from 'react';
import { ChevronDown, X, CheckCircle, AlertCircle } from 'lucide-react';

interface EducationData {
    location: string;
    school: string;
    degree: string;
    areaOfStudy: string;
    country: string;
    from: string;
    to: string;
}

type FormErrors = Partial<Record<keyof EducationData, string>>;

const EMPTY_FORM: EducationData = {
    location: '',
    school: '',
    degree: '',
    areaOfStudy: '',
    country: '',
    from: '',
    to: '',
};

const REQUIRED_FIELDS: (keyof EducationData)[] = ['school', 'degree'];

const LOCATIONS = ['On-site', 'Remote', 'Hybrid'];
const DEGREES = ["Associate's", "Bachelor's", "Master's", 'MBA', 'PhD', 'Diploma', 'Certificate', 'Other'];
const AREAS_OF_STUDY = ['Computer Science', 'Business Administration', 'Engineering', 'Mathematics', 'Design', 'Medicine', 'Law', 'Education', 'Arts & Humanities', 'Social Sciences', 'Other'];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i));

function validate(data: EducationData): FormErrors {
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

// ── Sub-components ──────────────────────────────────────────────

const SelectField: React.FC<{
    label: string;
    name: keyof EducationData;
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
    name: keyof EducationData;
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

// ── Main Component ───────────────────────────────────────────────

const EducationModal: React.FC<{ onClose?: () => void; onSave?: (data: EducationData) => void }> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState<EducationData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof EducationData]) {
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
        onSave?.(formData);
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
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                onClick={handleCancel}
                aria-hidden
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
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

                    {/* Form body */}
                    <div className="px-6 py-5">
                        {submitted && (
                            <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                                <CheckCircle size={16} aria-hidden />
                                Education added successfully!
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField
                                    label="location"
                                    name="location"
                                    value={formData.location}
                                    options={LOCATIONS}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="school / university"
                                    name="school"
                                    value={formData.school}
                                    error={errors.school}
                                    placeholder="e.g. Harvard University"
                                    onChange={handleChange}
                                />

                                <SelectField
                                    label="Degree"
                                    name="degree"
                                    value={formData.degree}
                                    options={DEGREES}
                                    error={errors.degree}
                                    onChange={handleChange}
                                />

                                <SelectField
                                    label="choose area of Study"
                                    name="areaOfStudy"
                                    value={formData.areaOfStudy}
                                    options={AREAS_OF_STUDY}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="country"
                                    name="country"
                                    value={formData.country}
                                    placeholder="e.g. Cambodia"
                                    onChange={handleChange}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <SelectField
                                        label="From"
                                        name="from"
                                        value={formData.from}
                                        options={YEARS}
                                        onChange={handleChange}
                                    />
                                    <SelectField
                                        label="to"
                                        name="to"
                                        value={formData.to}
                                        options={YEARS}
                                        error={errors.to}
                                        onChange={handleChange}
                                        extraOption={{ value: 'Present', label: 'Present' }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-md hover:bg-blue-100 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Add Education
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>
    );
};

export default EducationModal;