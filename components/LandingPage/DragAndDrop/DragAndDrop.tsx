import SectionTitle from "@/components/common/SectionTitle";
import React from "react";

const DragAndDrop = () => {
  return (
    <section className="flex flex-col md:flex-row justify-center md:justify-between gap-10 md:w-full h-full mb-10">
      <div className="w-full">
        <picture>
          <img src="/landingPage/collection_u2np.svg" alt="" />
        </picture>
      </div>
      <div className="flex flex-col justify-center w-full gap-y-4">
        <SectionTitle
          title="Drag & Drop Simple 💆‍♂️"
          subtitle="No coding, no headaches. Just drag and drop conversational elements and unleash your creativity... The possibilities are endless."
          customClass="text-left"
        />
        <div className="flex gap-5 text-gray-400">
          {[
            { title: "Drag & Drop" },
            { title: "No Coding" },
            { title: "Easy Integration" },
          ].map((item, index) => (
            <div className="flex items-center gap-x-2" key={index}>
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
              <h1>{item.title}</h1>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DragAndDrop;
