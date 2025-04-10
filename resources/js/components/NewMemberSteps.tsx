import { ChevronRight } from "lucide-react";

const NewMemberSteps = ({ step, setStep }: { step: number; setStep: (step: number) => void }) => {
    const steps = ["Personal", "Account", "Address"];

    return (
        <ol className="flex gap-2">
            {steps.map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                    <li
                        className={`flex items-center gap-2 ${
                            step === index + 1 ? "text-blue-600" : step > index + 1 ? "text-blue-600" : "text-gray-500"
                        }`}
                    >
                        <div className={`grid h-6 w-6 place-content-center rounded-full font-bold ${
                            step === index + 1
                                ? "bg-blue-600 text-white"
                                : step > index + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 text-black"
                        }`}>
                            {index + 1}
                        </div>
                        <span className="font-bold">{label}</span>
                    </li>
                    {index < steps.length - 1 && <ChevronRight />}
                </div>
            ))}
        </ol>
    );
};

export default NewMemberSteps;
