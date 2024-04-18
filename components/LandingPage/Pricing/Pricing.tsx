import React, { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Switch } from "@/components/ui/switch";


interface PricingTier {
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features?: string[];
}

const PricingTier: React.FC<{ tier: PricingTier; isYearly: boolean }> = ({
  tier,
  isYearly,
}) => {
  const getPrice = (tier: PricingTier) => (isYearly ? tier.yearlyPrice : tier.monthlyPrice);
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href")?.substring(1);
    const targetElement = document.getElementById(targetId || "");
    if (targetElement) {
      setTimeout(() => {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }, 500);
    }
  };
  return (
    <div className="flex-grow pt-[20px] pb-[30px] px-[25px] rounded-md bg-[#1E1B2C] text-center flex flex-col justify-between">
  <div>
    <h3 className="font-semibold text-[1.8em] w-[300px] break-words">{tier.title}</h3>
    <p className="h-[50px] text-[1.1em] text-center">{tier.description}</p>
    <div className="my-[25px]">
      <span className="text-[3em] leading-[1]">${getPrice(tier)}</span>
      <span className="interval">
        <span className="intervalSlash">/</span>
        mo
      </span>
    </div>
    <ul>
      {tier.features &&
        tier.features.map((feature, index) => (
          <li key={index} className="flex gap-2 items-center text-[1.1em] h-[50px]">
            <svg
              width="21px"
              height="17px"
              viewBox="0 0 21 17"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="ui-icons"
                  transform="translate(-109.000000, -67.000000)"
                  fill="#22BC66"
                >
                  <polygon
                    id="check"
                    points="108.994099 76.4000626 115.987848 83.419577 129.407253 69.9978283 126.587674 67.1592372 115.987848 77.7490936 111.827057 73.5894775"
                  ></polygon>
                </g>
              </g>
            </svg>
            {feature}
          </li>
        ))}
    </ul>
  </div>
  {/* button */}
  <a className="border border-[#4F46E5] py-[0.7em] px-[0.8em] rounded-md mt-[25px] hover:shadow-lg hover:shadow-[#6662a5]" href="#contact"  onClick={handleClick}>Request A Demo</a>
</div>

  );
};

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const handleSwitchChange = () => {
    setIsYearly(!isYearly);
  };

  const pricingTiers: PricingTier[] = [
    {
      title: "Starter 🌱",
      description: "For small sites & side projects",
      monthlyPrice: 37,
      yearlyPrice: 370,
      features: ["Up to 10 bots 🤖", "Up to 1,000 leads per month", "Lead export & Zapier integration", "Drag & drop bot builder", "Integrate anywhere", "Be the envy of your friends 🥇"],
    },
    {
      title: "Growth 💪",
      description: "For growing sites & brands",
      monthlyPrice: 97,
      yearlyPrice: 970,
      features: ["Unlimited bots 🤖", "Up to 5,000 leads per month", "Lead export & Zapier integration","Drag & drop bot builder", "Integrate anywhere", "Remove Aminos branding","Love ❤️ and respect 👊"],
    },
    {
      title: "Limitless / Agency 🚀",
      description: "For ballers & agencies",
      monthlyPrice: 97,
      yearlyPrice: 1970,
      features: ["Unlimited bots 🤖", "Unlimited leads", "Lead export & Zapier integration","Drag & drop bot builder", "Integrate anywhere", "Remove Aminos branding","VIP personal support 😎","You are awesome 💯"],
    },
  ];

  return (
    <section className="flex flex-col justify-center mb-10" id="pricing">
      <div className="text-center">
        <SectionTitle
          title="Simple, Transparent Pricing ❤️"
          subtitle="No hidden costs, ever."
          customClass="mb-[60px] lg:mb-[70px]"
        />
      </div>
      <div className="flex justify-center items-center mb-[40px] text-[1.1em] gap-2">
        <span className="cycleA">Billed Monthly</span>
        <div className="flex items-center space-x-2">
          <Switch
            id="price-mode"
            className="data-[state=unchecked]:bg-[#1E1B2C]"
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <span className="cycleB">
          Billed Yearly
          <span className="aboutB weight-text ml-2">(2 months free)</span>
        </span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {pricingTiers.map((tier) => (
          <PricingTier key={tier.title} tier={tier} isYearly={isYearly} />
        ))}
      </div>
    </section>
  );
};

export default Pricing;
