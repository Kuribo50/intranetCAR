import { PhoneDirectory } from "@/components/dashboard/PhoneDirectory";

export default function AnexosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-12 xl:px-16">
      <div className="w-full mx-auto">
        <PhoneDirectory />
      </div>
    </div>
  );
}
