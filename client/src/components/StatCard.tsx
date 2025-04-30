import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  label?: string;
  subValue?: string;
  helpText?: string | React.ReactNode;
  isSuccess?: boolean;
}

export default function StatCard({
  title,
  value,
  label,
  subValue,
  helpText,
  isSuccess = false
}: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <h3 className="text-text-secondary text-sm mb-2">{title}</h3>
      <p className={cn(
        "text-2xl font-bold space-grotesk",
        isSuccess && "text-accent"
      )}>
        {value} {label && <span className="text-sm text-text-secondary">{label}</span>}
      </p>
      
      {subValue && (
        <div className="mt-2 text-xs text-text-secondary">
          {subValue}
        </div>
      )}
      
      {helpText && (
        <div className="mt-2 text-xs text-text-secondary flex items-center">
          {helpText}
        </div>
      )}
    </div>
  );
}
