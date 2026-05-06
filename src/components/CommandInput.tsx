import { type KeyboardEvent, type RefObject } from 'react';

interface CommandInputProps {
  promptPath: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export const CommandInput = ({
  promptPath,
  value,
  onChange,
  onKeyDown,
  inputRef,
}: CommandInputProps) => {
  return (
    <div
      className="mt-6 flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-terminal-border/60 pb-1.5 transition-[border-color] duration-200 ease-out focus-within:border-terminal-accent/45"
      role="group"
      aria-label="Command line"
    >
      <span
        className="select-none text-[0.8125rem] font-medium leading-none tracking-wide sm:text-sm"
        aria-hidden
      >
        <span className="text-terminal-dim">souhail</span>
        <span className="text-terminal-muted">@</span>
        <span className="text-terminal-accent/90">portfolio</span>
        <span className="text-terminal-text">:</span>
        <span className="text-terminal-accent">{promptPath}</span>
        <span className="text-terminal-text">$</span>
      </span>
      <label className="sr-only" htmlFor="terminal-command-input">
        Terminal command input
      </label>
      <input
        id="terminal-command-input"
        ref={inputRef}
        type="text"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        autoComplete="off"
        aria-autocomplete="none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 min-h-[1.25em] bg-transparent text-[0.8125rem] text-terminal-text caret-terminal-accent outline-none placeholder:text-terminal-muted/55 selection:bg-terminal-accent/20 selection:text-terminal-text sm:text-sm"
        placeholder=""
        autoFocus
      />
      <span
        className="terminal-cursor-blink pointer-events-none inline-block h-4 w-2 rounded-sm bg-terminal-accent shadow-[0_0_12px_rgb(94_234_212/0.55)] md:h-[1.125rem]"
        aria-hidden
      />
    </div>
  );
};
