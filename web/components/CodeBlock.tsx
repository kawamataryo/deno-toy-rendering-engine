/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useMemo } from "preact/hooks";

export function CodeBlock(
  { code, language, label }: { code: string; language: string; label: string },
) {
  const highlightedCode = useMemo(
    () => Prism.highlight(code, Prism.languages[language], language),
    [code, language],
  );

  return (
    <div
      class={tw`block p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md`}
    >
      <p>{label}</p>
      <pre class={tw`h-[300px] overflow-scroll rounded-md text-xs`}>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
