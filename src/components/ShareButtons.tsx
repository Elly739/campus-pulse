import { toast } from "sonner";
import { MessageCircle, Twitter, Link as LinkIcon, Share2 } from "lucide-react";

export function ShareButtons({ title, url, text }: { title: string; url: string; text?: string }) {
  const shareText = text ?? `Check out ${title} on Campus Event Radar`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const whatsapp = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  const twitter = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
      } catch { /* user cancelled */ }
    } else {
      copy();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <button
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      <button
        onClick={nativeShare}
        aria-label="More share options"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent sm:hidden"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
