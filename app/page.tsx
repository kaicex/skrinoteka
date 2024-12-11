import { Container } from '@/components/ui/container';
import Link from 'next/link'
import { ArrowRight, Layout, Smartphone, Globe, Zap, RefreshCw, Users } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"



export default async function PricingPage() {

  return (
    <Container size="xl">
      <div>
        {/* Hero Section */}
        <div className="flex flex-col items-center">
          <div className="text-center max-w-4xl mx-auto pt-16 md:pt-24">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Discover & Learn from Real{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-green-400 to-green-500">
                UI Patterns
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
              The largest collection of mobile and web app UI design patterns, 
              flows, and interactions. Perfect for designers, developers, and product teams.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                variant="default"
                size="md"
              >
                <Link href="/browse/mobile">
                  Browse Apps
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="md"
              >
                <Link href="#pricing">
                  Browse Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-16 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-8 md:p-4 md:border md:border-dashed md:border-white/10 md:rounded-[2rem]">
              {[
                { label: "Apps", value: "1,000+", icon: Layout },
                { label: "Mobile Patterns", value: "5,000+", icon: Smartphone },
                { label: "Web Patterns", value: "3,000+", icon: Globe },
                { label: "UI Flows", value: "2,000+", icon: Zap }
              ].map(({ label, value, icon: Icon }) => (
                <div 
                  key={label} 
                  className="text-center px-3 py-6 lg:p-6 rounded-[1.5rem] border border-dashed md:border-solid border-white/10 hover:border-white/20 transition-all hover:scale-105"
                >
                  <Icon className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-white mb-1">{value}</div>
                  <div className="text-gray-400 text-lg">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Section */}
        <div className="pt-24 pb-12">
          <h2 className="text-5xl font-bold text-white text-center mb-12">
            Available on All Platforms
          </h2>
            
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'iOS',
                  description: 'Browse our curated library of 1000+ iOS apps. Get inspired by the best-in-class mobile experiences.',
                  link: '/browse/ios',
                  icon: '/ios-icon.svg'
                },
                {
                  title: 'Android',
                  description: 'Browse our curated library of 500+ Android apps. Get inspired by the best-in-class mobile experiences.',
                  link: '/browse/android',
                  icon: '/android-icon.svg'
                },
                {
                  title: 'Web',
                  description: 'Browse our curated library of 500+ Web apps. Get inspired by the best-in-class web experiences.',
                  link: '/browse/web',
                  icon: '/web-icon.svg'
                }
              ].map(({ title, description, link, icon }) => (
                <Link 
                  href={link}
                  key={title} 
                  className="group py-12 px-4 rounded-[1.5rem] border border-white/10 hover:border-gray-500/50 transition-all hover:scale-105 relative overflow-hidden h-[200px]"
                >
                  <div className="absolute -bottom-12 -right-12">
                    <Image 
                      src={icon} 
                      alt={title} 
                      width={240} 
                      height={240}
                      className="opacity-[0.06] md:opacity-[0.03] md:group-hover:opacity-[0.06] transition-opacity"
                    />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <h3 className="text-4xl font-semibold bg-gradient-to-r from-[#00FF85] to-[#00F0FF] bg-clip-text text-transparent md:bg-none md:text-gray-400 md:group-hover:bg-gradient-to-r md:group-hover:from-[#00FF85] md:group-hover:to-[#00F0FF] md:group-hover:bg-clip-text md:group-hover:text-transparent transition-all">
                        {title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      {description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
      </div>
    </Container>
  );
}



