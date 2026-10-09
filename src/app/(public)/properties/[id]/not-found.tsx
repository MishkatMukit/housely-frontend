import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1400px] flex-col items-center justify-center gap-6 px-5 text-center sm:px-8">
      <span className="stamp stamp-red">Not on file</span>
      <div className="max-w-md">
        <h1 className="display text-4xl text-ink">
          No such entry in the register
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          This property has been withdrawn, renamed, or never existed. Browse
          the open entries instead.
        </p>
      </div>
      <Button
        className="rounded-none bg-ink text-paper hover:bg-ink/90"
        render={<Link href="/properties" />}
      >
        Back to the register
      </Button>
    </div>
  );
}
