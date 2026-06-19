import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isPublicPath } from "@/lib/authConstants";

export default function AdminRouteGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (isPublicPath(router.pathname)) {
      setChecked(true);
      return;
    }

    let cancelled = false;

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.authenticated) {
          router.replace("/login");
          return;
        }
        setChecked(true);
      })
      .catch(() => {
        if (!cancelled) router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.pathname, router]);

  if (!checked) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return children;
}
