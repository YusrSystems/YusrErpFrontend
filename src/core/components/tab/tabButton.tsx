export type TabButtonProps = {
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
  content: React.ReactElement;
};
export default function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
        active
          ? "border-primary text-primary bg-primary/10 font-extrabold text-base"
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
