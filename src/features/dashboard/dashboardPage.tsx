import useDashbaord from "../../core/hooks/useDashboard";

export default function DashboardPage()
{
  // const { data } = useDashbaord();
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <h3>This Is Dashboard</h3>
      {/* { data && "This Is Dashboard" } */}
    </div>
  );
}
