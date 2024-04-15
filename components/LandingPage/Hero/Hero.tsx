import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row justify-center md:justify-between gap-10 md:w-full h-full mb-10">
      <div className="flex flex-col justify-center gap-y-8 text-left">
        <div className="flex flex-col justify-center">
          <h2 className="text-[28pt] md:text-[2.5em] lg:text-[3.5em] leading-[1.2] mb-[17px] whitespace-pre-line font-bold">
            Chatbots Made Easy 💪
          </h2>
          <p className="text-[14pt] md:text-[1.3em] lg:text-[1.5em] whitespace-pre-line font-normal text-gray-400">
            Collect more leads. Increase your conversions.
            <br />
            The future is conversational.
          </p>
        </div>
        <div className="flex space-x-4">
          <a className="px-[12px] py-2 bg-[#4840C9] flex items-center hover:shadow-lg hover:shadow-[#6662a5]" href="">
            <span>START NOW</span>{" "}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="rgba(255,255,255,1)"
                className="mt-[2px] ml-[2px]"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
            </span>
          </a>
          <a className="px-[12px] py-2 border border-[#4840C9] mr-5 hover:shadow-lg hover:shadow-[#6662a5]" href="">Request A Demo</a>
        </div>
      </div>
      <div className=" md:w-[65%] lg:w-[40%]">
        <picture>
          <img src="/landingPage/chatting_2yvo.svg" alt="" />
        </picture>
      </div>
    </section>
  );
};

export default Hero;
