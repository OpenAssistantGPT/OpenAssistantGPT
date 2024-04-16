import React from "react";
import SectionTitle from "@/components/common/SectionTitle";

const RequestDemo: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center gap-10 mb-10">
      <div className="text-center">
        <SectionTitle
          title="Request An Invite"
          subtitle="We're currently in beta, but are onboarding customers each week. Request a demo today."
          customClass=" mb-[10px]"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <form
          className="contact"
          id="contact_yauvlma3ggc"
          data-siteid="7rk6p0gy8v4m"
        >
          <div className="flex flex-col mb-[20px] w-full">
            <label className="mb-[3px] font-semibold">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              className="bg-transparent border-[2px] border-gray-500  p-[10px] rounder-[3px]  text-[1.15em]"
            />
          </div>
          <div className="flex justify-between flex-col md:flex-row w-full gap-x-4">
            <div className="flex flex-col mb-[20px] w-full">
              <label className="mb-[3px] font-semibold">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="jane.doe@mail.com"
                className="bg-transparent border-[2px] border-gray-500  p-[10px] rounder-[3px] w-full  text-[1.15em]"
              />
            </div>
            <div className="flex flex-col mb-[20px] w-full">
              <label className="mb-[3px] font-semibold">Phone (Optional)</label>
              <input
                id="phone"
                type="text"
                placeholder="(123) 456-7890"
                className="bg-transparent border-[2px] border-gray-500  p-[10px] rounder-[3px] w-full text-[1.15em]"
              />
            </div>
          </div>
          <div className="flex flex-col mb-[20px] w-full">
            <label className="mb-[3px] font-semibold">
              Tell us about your brand or company & what you hope to get out of
              the Aminos platform
            </label>
            <textarea
              id="message"
              placeholder=""
              className="bg-transparent border-[2px] border-gray-500  p-[10px] rounder-[3px]  text-[1.15em] min-h-[150px]"
            />
          </div>
          <div id="contactError_yauvlma3ggc" className="contact__error"></div>
          <div className="flex justify-end">
          <button
            id="contactSubmit_yauvlma3ggc"
            className="flex justify-end items-end bg-[#4F46E5] py-[0.7em] px-[0.8em]"
          >
            Request My Demo & Invitation
          </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RequestDemo;
