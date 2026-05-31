import { siGithub } from "simple-icons";

type Props = { size?: number; className?: string };

/** Official GitHub mark via simple-icons (lucide-react dropped brand icons). */
export function GithubIcon({ size = 16, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden="true"
      className={className}
    >
      <path d={siGithub.path} />
    </svg>
  );
}
