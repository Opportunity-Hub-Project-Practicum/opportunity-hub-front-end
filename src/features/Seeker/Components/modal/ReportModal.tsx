import { useState } from "react";
import TextAreaBox from "../../../../GlobalComponents/textAreaBox"
interface ReportModalProps {
    onClose?: () => void;
    onSubmit?: (report: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit }) => {
    const [value, setValue] = useState("");

    const handleCancel = () => {
        setValue("");
        onClose?.();
    };

    const handleSubmit = () => {
        onSubmit?.(value);
        setValue("");
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30" onClick={handleCancel} />

            <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex flex-col items-center ">
                    <h2 className="text-big font-bold text-gray-800">Report</h2>
                    <span className="flex items-start w-full">is something wrong with the post?</span>
                </div>

                <TextAreaBox value={value} onChange={setValue} />

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={handleCancel} className="btn-primary-white">Cancle
                    </button>
                    <button type="button" onClick={handleSubmit} className="bg-red-600 text-white px-4 py-2 rounded shadow-sm hover:bg-red-900 hover:text-white active:scale-95 transition-all;">
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;