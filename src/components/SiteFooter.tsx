import { GithubIcon } from "@/components/GithubIcon";

const WURZELHEIM_URL = "https://github.com/ichbinbobby/wurzelheim.de";
const REPO_URL = "https://github.com/Melina412/wurzelheim-stats";
const AUTHOR_URL = "https://github.com/Melina412";

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-base bg-card px-4 py-2 text-xs font-medium text-base-fg transition hover:border-brand hover:text-brand";

/** Global footer (every route): author credit + repo links. Text is constant
 *  (not translated). */
export function SiteFooter() {
  return (
    <footer className="border-t border-base pt-6 pb-4 text-center text-sm text-muted">
      <p className="mb-4 text-xs">
        made by{" "}
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-base-fg transition hover:text-brand"
        >
          Melina412
        </a>{" "}
        aka Melicyclonit
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={WURZELHEIM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <GithubIcon size={15} />
          wurzelheim.de
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <GithubIcon size={15} />
          wurzelheim-stats
        </a>
      </div>
    </footer>
  );
}
