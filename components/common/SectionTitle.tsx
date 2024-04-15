import React from "react";
interface TitleProps {
  title: string;
  subtitle: string;
  customClass?: string;
}
const SectionTitle: React.FC<TitleProps> = ({
  title,
  subtitle,
  customClass,
}) => {
  return (
    <div className={`flex flex-col gap-y-4`}>
      <h1 className="font-bold text-[45px] lg:text-[48px] leading-[1.3em]">
        {title}
      </h1>
      <p className={`text-[14pt] md:text-[1.3em] lg:text-[1.5em] whitespace-pre-line font-normal text-gray-400 max-w-[500px] lg:max-w-full ${customClass}`}>
        {subtitle}
      </p>
    </div>
  );
};

export default SectionTitle;
