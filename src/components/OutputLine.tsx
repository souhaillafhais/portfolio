import type { ReactNode } from 'react';

interface OutputLineProps {
  type?: 'command' | 'output' | 'error' | 'default';
  prefix?: string;
  children: ReactNode;
}

export const OutputLine = ({ type = 'default', prefix, children }: OutputLineProps) => {
  let colorClass = 'text-terminal-text';

  switch (type) {
    case 'command':
      colorClass = 'text-terminal-text';
      break;
    case 'output':
      colorClass = 'text-terminal-text';
      break;
    case 'error':
      colorClass = 'text-rose-400';
      break;
    case 'default':
      colorClass = 'text-terminal-text opacity-70';
      break;
  }

  return (
    <div className={`${colorClass} whitespace-pre-wrap break-words`}>
      {prefix && <span>{prefix}</span>}
      {children}
    </div>
  );
};
