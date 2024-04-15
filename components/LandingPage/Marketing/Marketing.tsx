import SectionTitle from "@/components/common/SectionTitle";
import React from "react";

const Marketing = () => {
  return (
    <section className="flex flex-col md:flex-row justify-center md:justify-between gap-10 md:w-full h-full mb-10">
      <div className="flex flex-col justify-center w-full gap-y-4">
        <SectionTitle
          title="💬 Conversational Marketing"
          subtitle="The web is turning conversational. Build and deploy simple automated chatbots that engage & delight your prospects, customers & users with a variety of exciting use cases."
          customClass="text-left"
        />
        <div className="flex justify-between text-[18px] text-gray-400">
          {[
            { title: "Surveys" },
            { title: "Lead Generation" },
            { title: "Nurturing" },
            { title: "Conversion" },
          ].map((item, index) => (
            <div className="flex gap-x-2" key={index}>
              <svg
                id="fi_5299035"
                enable-background="new 0 0 512 512"
                height="24"
                viewBox="0 0 512 512"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-rule="evenodd" fill-rule="evenodd">
                  <path
                    d="m116.049 194.505c-12.749-12.749-30.04-19.911-48.07-19.911s-35.321 7.163-48.07 19.913v.001c-26.546 26.547-26.545 69.587.001 96.134 38.398 38.399 95.897 95.901 134.296 134.301 12.748 12.749 30.039 19.912 48.069 19.912 18.029 0 35.321-7.162 48.069-19.91l241.745-241.745c26.546-26.545 26.548-69.583.006-96.132l-.007-.007c-12.749-12.751-30.04-19.915-48.071-19.916-18.03-.001-35.323 7.161-48.072 19.911l-188.021 188.02c-1.499 1.499-3.532 2.342-5.652 2.342s-4.153-.843-5.652-2.342z"
                    fill="#66bb6a"
                  ></path>
                  <path
                    d="m433.014 68.041c13.952 2.287 26.946 8.89 37.074 19.02l.007.007c26.542 26.549 26.54 69.587-.006 96.132l-241.745 241.745c-10.126 10.126-23.118 16.728-37.068 19.014 3.613.593 7.29.896 10.999.896 18.029 0 35.321-7.162 48.069-19.91l241.745-241.745c26.546-26.545 26.548-69.583.006-96.132l-.007-.007c-12.749-12.751-30.04-19.915-48.071-19.916-3.71 0-7.39.303-11.003.896z"
                    fill="#4caf50"
                  ></path>
                </g>
              </svg>
              <h1>{item.title}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <picture>
          <img src="/landingPage/begin_chat_c6pj.svg" alt="" />
        </picture>
      </div>
    </section>
  );
};

export default Marketing;
