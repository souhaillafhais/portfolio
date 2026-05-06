interface NeonWelcomeProps {
  visible: boolean;
  text: string;
}

export const NeonWelcome = ({ visible, text }: NeonWelcomeProps) => {
  if (!visible) return null;

  return (
    <p className="neon-welcome mt-3 max-w-2xl font-mono text-sm leading-relaxed tracking-wide md:text-base">
      {text}
    </p>
  );
};
