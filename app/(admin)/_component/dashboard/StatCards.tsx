import Link from "next/link";


export default function StatCards({ sateData }: any) {
  const statCards = [
    {
      title: "Total Users",
      value: sateData?.total_users,
      percentage: "+6%",
      icon: "/path/to/users-icon.svg", // Replace with actual image path
      timeFrame: "Last Month",
    },
    {
      title: "Total Gift used",
      value: sateData?.total_gift_sent,
      percentage: "+4%",
      icon: "/path/to/gift-icon.svg", // Replace with actual image path
      timeFrame: "Last Month",
    },
    {
      title: "Total Revenue",
      value: sateData?.total_revenue,
      percentage: "+8%",
      icon: "/path/to/active-subscription-icon.svg", // Replace with actual image path
      timeFrame: "Last Month",
    },
    {
      title: "Total Transactions",
      value: sateData?.failed_transactions,
      percentage: "+2%",
      icon: "/path/to/transactions-icon.svg", // Replace with actual image path
      timeFrame: "Last Month",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => (
        <Link href="#"
          key={idx}
          className="p-4 rounded-lg  bg-white flex hover:shadow-[2px_2px_7px_2px_rgba(0,_0,_0,_0.08)] transition-all card flex-col gap-3"
        >
          {/* Top Row */}
          <div className="flex items-center gap-3">
            <h4 className="text-sm  font-medium text-descriptionColor">{card.title}</h4>
          </div>


          <div className="">
            <div className="text-2xl  font-bold text-black">{card.value}</div>

          </div>
        </Link>
      ))}
    </div>
  );
}
