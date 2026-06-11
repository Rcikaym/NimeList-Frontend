import TrendingTopics from "../TrendingTopics";

export default function TrendingSidebar() {
  return (
    <aside className="w-56 flex-shrink-0 hidden lg:block">
      <div
        className="rounded-xl overflow-hidden sticky top-20"
        style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-semibold text-center uppercase tracking-wider text-slate-400">
            Trending This Month
          </p>
        </div>
        <ul className="divide-y divide-white/[0.04]">
          <TrendingTopics />
        </ul>
      </div>
    </aside>
  );
}