import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-neutral-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden">
      <Button href={siteConfig.phoneHref} variant="secondary" className="flex-1 justify-center" size="sm">
        <Phone className="h-4 w-4" aria-hidden />
        Call Now
      </Button>
      <Button href="#quote" className="flex-1 justify-center" size="sm">
        Get My Quote
      </Button>
    </div>
  );
}
