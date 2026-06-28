import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useT } from "@/i18n/context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ColorSchemePicker } from "@/components/ColorSchemePicker";
import type { ColorScheme } from "@/domains/club/club.types";
import type { ApiErrorCode } from "@/shared/api-errors";

type Step = "auth" | "input" | "configure" | "generating";

const STEP_NO: Record<Exclude<Step, "generating">, number> = {
  auth: 1,
  input: 2,
  configure: 3,
};

const inputCls =
  "w-full rounded-xl border border-base bg-card px-4 py-3 text-base-fg outline-none transition focus:border-brand";
const btnPrimary =
  "w-full rounded-xl bg-brand px-5 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
const linkCls =
  "text-sm text-muted underline-offset-2 transition hover:text-brand hover:underline";

// README section explaining why some clubs have no data (added later).
const README_HELP_URL =
  "https://github.com/Melina412/wurzelheim-stats#warum-keine-stats";

/** Send a master-pw-gated POST and return { ok, data }. */
async function postJson(path: string, body: unknown, password: string) {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-master-password": password,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data } as {
    ok: boolean;
    data: { error?: ApiErrorCode; clubId?: string; clubName?: string | null };
  };
}

export function Generate() {
  const t = useT();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("auth");
  const [password, setPassword] = useState("");
  const [inputMode, setInputMode] = useState<"id" | "link">("id");
  const [clubInput, setClubInput] = useState("");
  const [resolved, setResolved] = useState<{
    clubId: string;
    clubName: string | null;
  } | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("green");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiErrorCode | null>(null);

  // Live preview: the whole page themes to the picked scheme (green by default).
  useColorScheme(colorScheme);

  // --- step handlers ---
  async function submitAuth(e: SyntheticEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { ok, data } = await postJson("/api/auth", {}, password);
    setBusy(false);
    if (ok) setStep("input");
    else setError(data.error ?? "server_error");
  }

  async function submitInput(e: SyntheticEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { ok, data } = await postJson(
      "/api/clubs/preview",
      { club: clubInput },
      password,
    );
    setBusy(false);
    if (ok && data.clubId) {
      setResolved({ clubId: data.clubId, clubName: data.clubName ?? null });
      setDisplayName(data.clubName ?? "");
      setStep("configure");
    } else {
      setError(data.error ?? "server_error");
    }
  }

  async function submitGenerate() {
    if (!resolved) return;
    setBusy(true);
    setError(null);
    setStep("generating");
    const { ok, data } = await postJson(
      "/api/clubs/generate",
      { club: resolved.clubId, displayName: displayName.trim(), colorScheme },
      password,
    );
    setBusy(false);
    if (ok && data.clubId) {
      navigate(`/club/${data.clubId}`);
    } else {
      setError(data.error ?? "server_error");
      setStep("configure");
    }
  }

  function switchMode(mode: "id" | "link") {
    setInputMode(mode);
    setClubInput("");
    setError(null);
  }

  const errorMsg = error ? (
    <div className="mt-3 space-y-1">
      <p className="text-sm text-red-600 dark:text-red-400">
        {t(`errors.${error}`)}
      </p>
      {error === "rate_limited" && resolved && (
        <Link to={`/club/${resolved.clubId}`} className={linkCls}>
          {t("generate.toExisting")}
        </Link>
      )}
      {error === "no_events" && (
        <>
          <p className="text-sm text-muted">{t("generate.noEventsHint")}</p>
          <a
            href={README_HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            {t("generate.moreInfo")}
          </a>
        </>
      )}
    </div>
  ) : null;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {step !== "generating" && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("generate.stepLabel", { n: STEP_NO[step], total: 3 })}
          </p>
        )}

        {/* STEP 1 — AUTH */}
        {step === "auth" && (
          <form onSubmit={submitAuth}>
            <h1 className="text-2xl font-black tracking-tight text-base-fg">
              {t("generate.auth.title")}
            </h1>
            <p className="mt-2 mb-6 text-muted">{t("generate.auth.desc")}</p>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("generate.auth.placeholder")}
              className={inputCls}
            />
            {errorMsg}
            <button
              type="submit"
              disabled={busy || !password}
              className={`${btnPrimary} mt-5`}
            >
              {t("generate.auth.submit")}
            </button>
          </form>
        )}

        {/* STEP 2 — INPUT (id by default, link branch on demand) */}
        {step === "input" && (
          <form onSubmit={submitInput}>
            {inputMode === "id" ? (
              <>
                <h1 className="text-2xl font-black tracking-tight text-base-fg">
                  {t("generate.input.idTitle")}
                </h1>
                <p className="mt-2 mb-6 text-muted">
                  {t("generate.input.idDesc")}
                </p>
                <input
                  autoFocus
                  value={clubInput}
                  onChange={(e) => setClubInput(e.target.value)}
                  placeholder={t("generate.input.idPlaceholder")}
                  className={inputCls}
                />
                {errorMsg}
                <button
                  type="submit"
                  disabled={busy || !clubInput.trim()}
                  className={`${btnPrimary} mt-5`}
                >
                  {t("generate.input.submit")}
                </button>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => switchMode("link")}
                    className={linkCls}
                  >
                    {t("generate.input.noId")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-black tracking-tight text-base-fg">
                  {t("generate.input.linkTitle")}
                </h1>
                <p className="mt-2 mb-6 text-muted">
                  {t("generate.input.linkDesc")}
                </p>
                <input
                  autoFocus
                  value={clubInput}
                  onChange={(e) => setClubInput(e.target.value)}
                  placeholder={t("generate.input.linkPlaceholder")}
                  className={inputCls}
                />
                {errorMsg}
                <button
                  type="submit"
                  disabled={busy || !clubInput.trim()}
                  className={`${btnPrimary} mt-5`}
                >
                  {t("generate.input.submit")}
                </button>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => switchMode("id")}
                    className={linkCls}
                  >
                    {t("generate.input.haveId")}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* STEP 3 — CONFIGURE */}
        {step === "configure" && resolved && (
          <div>
            <h1 className="text-2xl font-black tracking-tight text-base-fg">
              {t("generate.configure.title")}
            </h1>
            <p className="mt-2 mb-6 text-muted">
              {resolved.clubName
                ? t("generate.configure.found", { name: resolved.clubName })
                : t("generate.configure.foundId", { id: resolved.clubId })}
            </p>

            <label className="mb-1 block text-sm font-semibold text-base-fg">
              {t("generate.configure.nameLabel")}
            </label>
            <p className="mb-2 text-xs text-muted">
              {t("generate.configure.nameDesc")}
            </p>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("generate.configure.namePlaceholder")}
              maxLength={60}
              className={inputCls}
            />

            <label className="mt-6 mb-3 block text-sm font-semibold text-base-fg">
              {t("generate.configure.colorLabel")}
              <p className="mb-2 text-xs text-muted font-normal">
                {t("generate.configure.colorDesc")}
              </p>
            </label>
            <ColorSchemePicker value={colorScheme} onChange={setColorScheme} />

            {errorMsg}

            <button
              type="button"
              onClick={submitGenerate}
              disabled={busy || !displayName.trim()}
              className={`${btnPrimary} mt-7`}
            >
              {t("generate.configure.submit")}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("input");
                }}
                className={linkCls}
              >
                {t("generate.back")}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — GENERATING */}
        {step === "generating" && (
          <div className="text-center">
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-3 border-base border-t-brand" />
            <h1 className="text-2xl font-black tracking-tight text-base-fg">
              {t("generate.generating.title")}
            </h1>
            <p className="mt-2 text-muted">{t("generate.generating.desc")}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
