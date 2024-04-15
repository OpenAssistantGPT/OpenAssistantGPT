import SectionTitle from '@/components/common/SectionTitle';
import React from 'react';

const Lead = () => {
    return (
        <section  className="flex flex-col md:flex-row justify-center md:justify-between gap-10 md:w-full h-full mb-10">
            <div className="flex flex-col justify-center w-full gap-y-4">
        <SectionTitle
          title="Lead Gen, Reinvented 🤖"
          subtitle="Forget static forms or boring surveys. Our automated chatbots are a new, engaging way to generate leads or survey your prospects."
          customClass="text-left"
        />
      <div className='flex flex-col gap-y-6'>
        <div className='flex mt-[30px]'>
        <div className="relative inline-flex flex-shrink-0 justify-center items-center medium hexagon w-[34px] h-[34px] mr-[14px] mt-[4px] " ><svg className="left-[50%] absolute top-0 z-0 -translate-[50%]" width="29.9985" height="35" viewBox="0 0 24 27" xmlns="http://www.w3.org/2000/svg"><path d="M12.016 27a4.387 4.387 0 0 1-2.298-.642l-7.42-4.395A4.755 4.755 0 0 1 0 17.907V9.085c0-1.69.886-3.246 2.298-4.057L9.718.634a4.424 4.424 0 0 1 4.564 0l7.42 4.394A4.755 4.755 0 0 1 24 9.085v8.788c0 1.69-.886 3.245-2.298 4.057l-7.387 4.428c-.723.44-1.51.642-2.299.642z" fill="rgba(207, 230, 255, 1.0)" fill-rule="nonzero"></path></svg><svg className="z-[999] bg-auto bg-center bg-no-repeat" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg></div>
        </div>
      </div>
      </div>
              <div className="w-full">
        <picture>
          <img src="/landingPage/messenger_e7iu.svg" alt="" />
        </picture>
      </div>
        </section>
    );
};

export default Lead;