import React, { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";

const RequestDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };
  return (
    <section className="flex flex-col justify-center items-center gap-10 mb-10">
      <div className="text-center" id="contact">
        <SectionTitle
          title="Request An Invite"
          subtitle="We're currently in beta, but are onboarding customers each week. Request a demo today."
          customClass=" mb-[10px]"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <form
          className="contact"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col mb-[20px] w-full">
            <label className="mb-[3px] font-semibold">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              className="bg-transparent border-[2px] border-gray-500  p-[10px] rounded-md  text-[1.15em]"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between flex-col md:flex-row w-full gap-x-4">
            <div className="flex flex-col mb-[20px] w-full">
              <label className="mb-[3px] font-semibold">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="jane.doe@mail.com"
                className="bg-transparent border-[2px] border-gray-500  p-[10px] rounded-md w-full  text-[1.15em]"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col mb-[20px] w-full">
              <label className="mb-[3px] font-semibold">Phone (Optional)</label>
              <input
                id="phone"
                type="text"
                placeholder="(123) 456-7890"
                className="bg-transparent border-[2px] border-gray-500  p-[10px] rounded-md w-full text-[1.15em]"
                value={formData.phone}
                onChange={handleChange}
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
              className="bg-transparent border-[2px] border-gray-500  p-[10px] rounded-md text-[1.15em] min-h-[150px]"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <div id="contactError" className="contact__error"></div>
          <div className="flex justify-center md:justify-end">
          <button
              id="contactSubmit"
              className="flex justify-end items-end bg-[#4F46E5] rounded-md py-[0.7em] px-[0.8em]"
              type="submit"
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
