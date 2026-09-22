import "./programme-tokens.css";
import { ProgrammeProvider } from "@/lib/programme-context";

export default function ProgrammeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgrammeProvider>
      {children}
    </ProgrammeProvider>
  );
}
