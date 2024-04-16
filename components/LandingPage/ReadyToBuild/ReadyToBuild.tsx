import SectionTitle from "@/components/common/SectionTitle";
import React from "react";

const ReadyToBuild = () => {
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
          className="px-[12px] py-2 bg-[#4840C9] flex items-center hover:shadow-lg hover:shadow-[#6662a5]"
          href=""
        >
          START NOW
        </a>
        <a
          className="px-[12px] py-2 border border-[#4840C9] mr-5 hover:shadow-lg hover:shadow-[#6662a5]"
          href=""
        >
          Request A Demo
        </a>
      </div>
    </section>
  );
};

export default ReadyToBuild;
