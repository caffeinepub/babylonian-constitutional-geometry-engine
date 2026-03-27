import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025. Construído com</span>
            <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
            <span>usando</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            Base-60 Babylonian Division • Euclidean GCD Consensus • TMR 2-of-3
          </div>
        </div>
      </div>
    </footer>
  );
}
