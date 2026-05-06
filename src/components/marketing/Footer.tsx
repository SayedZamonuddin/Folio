import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold">Folio</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your career, one link.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Product</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Account</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Folio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
