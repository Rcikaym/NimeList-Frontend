import React from "react";
import { FaShieldAlt, FaUserFriends } from "react-icons/fa";
import { TbMessageCircleExclamation, TbAlertCircle } from "react-icons/tb";
import { LuFileHeart } from "react-icons/lu";
import { div } from "framer-motion/client";

export default function CommunityGuidelines() {
  const Section = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: any;
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      className="mb-8 p-6 rounded-lg bg-opacity-10"
      style={{ backgroundColor: "#008576b7" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6" style={{ color: "#1ecab6" }} />
        <h2 className="text-xl font-bold m-0" style={{ color: "#1ecab6" }}>
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-white">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#1ecab6" }}>
            Community Guidelines
          </h1>
          <p className="text-white text-lg">
            Welcome to our community! These guidelines help ensure a positive
            experience for everyone.
          </p>
        </div>

        <Section icon={FaShieldAlt} title="General Conduct">
          <p>
            Be respectful and professional in all interactions. Avoid personal
            attacks, harassment, or discriminatory behavior.
          </p>
          <p>
            Keep discussions constructive and on-topic. Avoid derailing threads
            or posting spam.
          </p>
        </Section>

        <Section icon={TbMessageCircleExclamation} title="Posting Guidelines">
          <p>
            Before asking a question, search existing posts to avoid duplicates.
          </p>
          <p>Write clear, detailed titles that summarize your topic.</p>
          <p>
            Format your posts properly using appropriate headers, code blocks,
            and paragraphs.
          </p>
          <p>Include relevant details and context in your questions.</p>
        </Section>

        <Section icon={FaUserFriends} title="Community Participation">
          <p>Help others when you can. Share your knowledge and experience.</p>
          <p>Accept constructive criticism gracefully and provide it kindly.</p>
          <p>Upvote helpful content and flag inappropriate content.</p>
        </Section>

        <Section icon={TbAlertCircle} title="Content Restrictions">
          <p>No promotional content or spam without prior approval.</p>
          <p>Avoid sharing personal information or sensitive data.</p>
          <p>Don't post copyrighted material without proper attribution.</p>
        </Section>

        <Section icon={LuFileHeart} title="Best Practices">
          <p>Keep discussions focused on the topic at hand.</p>
          <p>Credit sources and references when applicable.</p>
          <p>Edit and update your posts to improve clarity.</p>
          <p>Be patient with new community members.</p>
        </Section>

        <div
          className="mt-12 p-6 rounded-lg text-center bg-opacity-10"
          style={{ backgroundColor: "#008576b7" }}
        >
          <p className="text-white-500">
            These guidelines are subject to change. Violation of these
            guidelines may result in warnings or account restrictions.
          </p>
        </div>
      </div>
    </div>
  );
}
