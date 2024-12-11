import Link from 'next/link';

const footerLinks = {
  product: [
    { name: "Browse Apps", href: "/browse" },
    { name: "iOS Apps", href: "/browse?platform=ios" },
    { name: "Android Apps", href: "/browse?platform=android" },
    { name: "Web Apps", href: "/browse?platform=web" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Design System", href: "#" },
    { name: "UI Components", href: "#" },
    { name: "Flow Library", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "License", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* <div className="border border-dashed border-border rounded-[2rem] p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 rounded-[1.5rem] p-6">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-foreground font-semibold mb-4 capitalize">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div> */}

        <div className="flex flex-col md:flex-row justify-between items-center py-4 mt-8 border-t border-border">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-foreground">
              Skreenoteka
            </Link>
            <span className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-muted-foreground text-sm">
              Dev/des by{' '}
              <Link
                href="https://t.me/kaicex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-foreground transition-colors"
              >
                Kairat
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
