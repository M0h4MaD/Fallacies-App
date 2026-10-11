import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Check, X, Award, Lock } from "lucide-react";
import { useAuthStore, updateDisplayName } from "../store/authStore";
import { BADGE_LABELS } from "../lib/badgeLabels";
import { isSoundEnabled, setSoundEnabled } from "../lib/sound";

export default function ProfilePage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const appUser = useAuthStore((s) => s.appUser);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(appUser?.displayName ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!appUser)
    return (
      <p className="text-text-muted">
        {lang === "ar"
          ? "سجّل دخول لتشوف ملفك."
          : "Sign in to see your profile."}
      </p>
    );

  async function saveName() {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    setNameError(null);
    const result = await updateDisplayName(nameInput.trim());
    setIsSaving(false);
    if (result.ok) setIsEditing(false);
    else setNameError(result.error);
  }

  return (
    <div>
      {isEditing ? (
        <div className="mb-1 flex items-center gap-2">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={60}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 font-heading text-xl font-bold text-text outline-none focus:border-brand"
          />
          <button
            onClick={saveName}
            disabled={isSaving}
            className="cursor-pointer rounded-lg border border-brand p-1.5 text-brand hover:bg-brand/10 disabled:cursor-default"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNameInput(appUser.displayName);
              setNameError(null);
            }}
            className="cursor-pointer rounded-lg border border-border p-1.5 text-text-muted hover:bg-bg"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="mb-1 flex items-center gap-2">
          <h1 className="font-heading text-3xl font-bold text-text">
            {appUser.displayName}
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-text-muted hover:text-brand"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}
      {nameError && <p className="mb-2 text-sm text-flag">{nameError}</p>}
      <p className="mb-8 text-text-muted">
        {lang === "ar" ? `مستوى ${appUser.level}` : `Level ${appUser.level}`}
      </p>

      <div className="mb-10 grid grid-cols-3 gap-4">
        <Stat label={lang === "ar" ? "نقاط الخبرة" : "XP"} value={appUser.xp} />
        <Stat
          label={lang === "ar" ? "أيام متتالية" : "Streak"}
          value={appUser.streak}
        />
        <Stat
          label={lang === "ar" ? "الشارات" : "Badges"}
          value={appUser.badgeIds.length}
        />
      </div>

      <h2 className="mb-3 font-heading text-lg font-bold text-text">
        {lang === "ar" ? "الشارات" : "Badges"}
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {Object.entries(BADGE_LABELS).map(([id, label]) => {
          const earned = appUser.badgeIds.includes(id);
          return (
            <div
              key={id}
              className={[
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-center",
                earned
                  ? "border-reward bg-surface shadow-[var(--shadow-elevated)]"
                  : "border-border bg-bg opacity-50",
              ].join(" ")}
            >
              {earned ? (
                <Award size={24} className="text-reward" strokeWidth={1.75} />
              ) : (
                <Lock
                  size={20}
                  className="text-text-muted"
                  strokeWidth={1.75}
                />
              )}
              <p className="text-xs text-text-muted">{label[lang]}</p>
            </div>
          );
        })}
      </div>
      <h2 className="mb-3 mt-10 font-heading text-lg font-bold text-text">
        {lang === "ar" ? "الإعدادات" : "Settings"}
      </h2>
      <label className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-sm">
        <span className="text-text">
          {lang === "ar" ? "الأصوات" : "Sounds"}
        </span>
        <input
          type="checkbox"
          defaultChecked={isSoundEnabled()}
          onChange={(e) => setSoundEnabled(e.target.checked)}
          className="h-5 w-5 accent-brand"
        />
      </label>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center shadow-[var(--shadow-elevated)]">
      <p className="font-heading text-2xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  );
}
