"use client";
import { Button } from "@nextui-org/react";
import CrossfadeCarousel from "./CrossfadeCarousel";
import MostPopular from "./MostPopularComponents";
import Recommended from "./RecommendedComponents";
import Link from "next/link";
import { MdPlayArrow } from "react-icons/md";
import NewlyArrived from "./NewlyArrivedComponent";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative w-full px-4 lg:px-8 py-6 lg:py-10">
        {/* subtle radial glow behind hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(5,225,198,0.08) 0%, transparent 70%)",
          }}
        />
        <CrossfadeCarousel interval={10000} />
      </section>

      {/* ── thin teal divider ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="mx-auto w-3/4 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(5,225,198,0.35), transparent)",
        }}
      />

      {/* ── Recommendation ───────────────────────────────────────── */}
      <section className="relative w-full mt-10 md:mt-14 px-4 md:px-8 overflow-hidden">
        <SectionHeader label="Recommendation" />
        <div className="mt-4">
          <Recommended />
        </div>
      </section>

      {/* ── Most Popular ─────────────────────────────────────────── */}
      <section className="relative w-full mt-10 md:mt-14 px-4 md:px-8 overflow-hidden">
        <SectionHeader
          label="Most Popular"
          action={
            <Link href="/most_popular">
              <Button
                variant="ghost"
                color="primary"
                size="sm"
                className="font-jakarta font-semibold text-teal-300 border-teal-500/40 hover:border-teal-400"
              >
                View More
              </Button>
            </Link>
          }
        />
        <div className="mt-4">
          <MostPopular />
        </div>
      </section>

      {/* ── Newly Arrived ────────────────────────────────────────── */}
      <section className="relative w-full mt-10 md:mt-14 overflow-hidden">
        {/* accent strip — subtle, not overwhelming */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, transparent 60%, rgba(0,153,81,0.07) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(5,225,198,0.2), rgba(0,153,81,0.3), transparent)",
          }}
        />

        <div className="px-4 md:px-8 pt-10 pb-6">
          <SectionHeader
            label="Newly Arrived"
            sublabel="Epic adventures await — the hottest new releases of the season."
            labelColor="from-[#05E1C6] to-[#00c85a]"
            action={
              <Link href="/newly_arrived">
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  className="font-jakarta font-semibold text-teal-300"
                  endContent={<MdPlayArrow />}
                >
                  View All
                </Button>
              </Link>
            }
          />
          <div className="mt-4">
            <NewlyArrived />
          </div>
        </div>
      </section>

      {/* ── CTA footer strip ─────────────────────────────────────── */}
      <section className="w-full mt-10 md:mt-16 py-16">
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <img
            src="/images/tired-avatar.png"
            alt="Explore more"
            className="select-none w-20 h-20 object-contain opacity-80"
          />
          <p className="font-jakarta text-sm md:text-base font-medium text-gray-400 max-w-xs leading-relaxed">
            Haven&rsquo;t found what you&rsquo;re looking for?
            <br />
            Explore our full library for more.
          </p>
          <Button
            className="font-jakarta font-bold text-indigo-50"
            color="primary"
            size="md"
            variant="ghost"
            as={Link}
            href="/explore"
          >
            Dive Deeper
          </Button>
        </div>
      </section>
    </main>
  );
}

/* ── Reusable section header ───────────────────────────────────────── */
interface SectionHeaderProps {
  label: string;
  sublabel?: string;
  action?: React.ReactNode;
  labelColor?: string;
}

function SectionHeader({
  label,
  sublabel,
  action,
  labelColor = "from-[#05E1C6] to-[#008576b7]",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-4 md:px-8">
      <div>
        <h2
          className={`w-fit font-jakarta text-xl md:text-2xl lg:text-3xl font-black select-none bg-gradient-to-r ${labelColor} bg-clip-text text-transparent`}
        >
          {label}
        </h2>
        {sublabel && (
          <p className="mt-1 font-jakarta text-xs md:text-sm text-gray-400 max-w-sm">
            {sublabel}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
