import { SmoothScroll } from "@/components/premium/SmoothScroll";
import "./lab.css";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
