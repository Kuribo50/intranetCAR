import { Search } from "lucide-react";
import { Input } from "@/components/ui/input"; // I need to create Input component too! Or just inline it.
import { cn } from "@/lib/utils";

// I'll create a simple input here or I should strictly create ui/input.tsx.
// Shadcn usually has Input. I'll create Input component as well in this turn or next.
// For now I'll use standard input tag to be fast, or create Input component correctly.
// Let's create `components/ui/input.tsx` as well.

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder="Buscar aplicaciones..."
        {...props}
      />
    </div>
  );
}
