import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallback?: ReactNode;
};

/**
 * Image with one automatic retry (network hiccups) and a graceful fallback
 * instead of the browser's broken-image icon.
 */
export function SmartImage({ src, fallback = null, alt = "", ...rest }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback}</>;

  return (
    <img
      {...rest}
      alt={alt}
      src={attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}r=${attempt}`}
      onError={() => (attempt < 2 ? setAttempt((a) => a + 1) : setFailed(true))}
    />
  );
}
