import { Layout } from "../components/Layout";
import { Zap } from "lucide-react";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <Zap size={64} className="text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 max-w-md">
          This page is coming soon. Keep prompting to fill in the contents of this page.
        </p>
      </div>
    </Layout>
  );
}
