/** @jsx h */

import { h } from "preact";
import { tw } from "@twind";
import { useEffect, useMemo, useRef } from "preact/hooks";

export function CodeBlockWithTextarea(
  { code, language, label, setCode }: {
    code: string;
    language: string;
    label: string;
    setCode: (val: string) => void;
  },
) {
  const highlightedCode = useMemo(
    () => Prism.highlight(code, Prism.languages[language], language),
    [code, language],
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!(preRef.current && textareaRef.current)) return;
    textareaRef.current.addEventListener("scroll", () => {
      if (!(preRef.current && textareaRef.current)) return;
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    });
  }, []);

  return (
    <div
      class={tw`block p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md`}
    >
      <p>{label}</p>
      <div class={tw`relative`}>
        <pre
          ref={preRef}
          class={tw`h-[300px] overflow-scroll rounded-md text-xs`}
        >
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
        <textarea
          className="code-block-textarea"
          value={code}
          ref={textareaRef}
          onInput={(e: { target: { value: string } }) =>
            setCode(e.target.value)}
        />
      </div>
    </div>
  );
}
