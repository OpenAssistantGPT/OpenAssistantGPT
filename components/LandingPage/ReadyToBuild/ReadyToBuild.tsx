import SectionTitle from "@/components/common/SectionTitle";
import React from "react";

const ReadyToBuild = () => {
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
    <section className="flex flex-col justify-center items-center gap-10 mb-10">
      <div className="text-center">
        <SectionTitle
          title="Ready To Build?"
          subtitle="Request a demo and get onboarded in as little as 48 hours 🙌"
          customClass=" mb-[5px]"
        />
      </div>
      <div className="flex space-x-4">
        <a
          className="px-[12px] py-2 bg-[#4840C9] flex items-center hover:shadow-lg rounded-md hover:shadow-[#6662a5]"
          href=""
          onClick={handleClick}
        >
          START NOW
        </a>
        <a
          className="px-[12px] py-2 border border-[#4840C9] mr-5 hover:shadow-lg rounded-md hover:shadow-[#6662a5]"
          href="#contact"
          onClick={handleClick}
        >
          Request A Demo
        </a>
      </div>
    </section>
  );
};

export default ReadyToBuild;
