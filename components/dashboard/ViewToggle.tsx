import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => onViewChange("grid")}
        title="Vista Cuadrícula"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => onViewChange("list")}
        title="Vista Lista"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
