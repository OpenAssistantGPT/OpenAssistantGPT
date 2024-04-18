import SectionTitle from "@/components/common/SectionTitle";
import React from "react";

const Work = () => {
  return (
    <section className="flex flex-col justify-center mb-10">
      <div className="text-center">
        <SectionTitle
          title="Works Everywhere 👌"
          subtitle="Anywhere you can insert a code snippet, we're there... including some of our favourites."
          customClass=" mb-[60px] lg:mb-[70px]"
        />
      </div>
      <div className="flex flex-wrap justify-center md:justify-between gap-4">
        <picture>
          <img src="/landingPage/logo/shopify.png" alt="" />
        </picture>
        <picture>
          <img src="/landingPage/logo/click.png" alt="" />
        </picture>
        <picture>
          <img src="/landingPage/logo/wordpress.png" alt="" />
        </picture>
        <picture>
          <img src="/landingPage/logo/squarespace.png" alt="" />
        </picture>
        <picture>
          <img src="/landingPage/logo/concertri.png" alt="" />
        </picture>
      </div>
    </section>
  );
};

export default Work;
