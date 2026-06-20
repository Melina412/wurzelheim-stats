import { Fragment, type ReactNode } from "react";

/** Render a translated template with `{token}` placeholders, swapping each for a
 *  provided node (e.g. a styled <span>). Keeps one i18n key per sentence while
 *  allowing inline styling/bold on dynamic values. */
export function rich(
  template: string,
  values: Record<string, ReactNode>,
): ReactNode {
  return template.split(/(\{[^}]+\})/).map((part, i) => {
    const m = /^\{([^}]+)\}$/.exec(part);
    return (
      <Fragment key={i}>{m && m[1] in values ? values[m[1]] : part}</Fragment>
    );
  });
}
