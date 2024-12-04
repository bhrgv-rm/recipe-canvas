import Link from "next/link";

export default function NotFound() {
  return (
    <body>
      <div className="not-found">
        <h2>404</h2>
        <p>This page is not created yet :)</p>
        <Link href="/">
          <button className="bg-foreground text-background border-background">
            Return to Home
          </button>
        </Link>
      </div>
    </body>
  );
}
