import logoSrc from "../../assets/volthub-logo.svg";

type LogoProps = {
  className?: string;
  alt?: string;
};

export function Logo({ className = "w-16 h-16", alt = "VoltHub logo" }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`${className} rounded-xl object-cover`}
      draggable={false}
    />
  );
}
