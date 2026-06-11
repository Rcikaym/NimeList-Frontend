interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md";
}

export default function Avatar({ name, src, size = "md" }: AvatarProps) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-xs";
  const initials = name.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${dim} rounded-full object-cover flex-shrink-0 ring-2 ring-white/10`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ background: "linear-gradient(135deg, #009951, #00c864)" }}
    >
      {initials}
    </div>
  );
}