import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal use",
    features: [
      "Unlimited static QR codes",
      "Basic color customization",
      "PNG & SVG downloads",
      "No tracking or analytics",
    ],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Starter",
    price: "$7",
    period: "/month",
    description: "For small businesses",
    features: [
      "Everything in Free",
      "5 dynamic QR codes",
      "Scan analytics",
      "Location tracking",
      "Device analytics",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    popular: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For growing teams",
    features: [
      "Everything in Starter",
      "50 dynamic QR codes",
      "Bulk QR generation",
      "API access",
      "Custom branding",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    popular: false,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited dynamic QR codes",
      "Team collaboration",
      "White-label options",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start for free. Upgrade when you need more features.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-primary shadow-lg" : ""}
            >
              <CardHeader>
                {plan.popular && (
                  <Badge className="mb-2 w-fit">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

          <div className="mt-8 space-y-6 text-left">
            <div>
              <h3 className="font-semibold">
                What&apos;s the difference between static and dynamic QR codes?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Static QR codes encode data directly and cannot be changed.
                Dynamic QR codes point to our servers and can be updated anytime
                without reprinting. They also include scan analytics.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I cancel anytime?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes! All paid plans are billed monthly with no long-term
                commitment. You can cancel anytime from your dashboard.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                What happens to my dynamic QR codes if I downgrade?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Your QR codes will continue to work, but you won&apos;t be able to
                create new ones beyond your plan&apos;s limit or access analytics.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
