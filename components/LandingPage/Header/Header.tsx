import React from "react";

const Header = () => {
  const navList = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Features",
      path: "/features",
    },
    {
      title: "Pricing",
      path: "/pricing",
    },
  ];

  return (
    <div className="flex justify-between items-center">
      <div className="font-bold text-[24px]">
        <picture>
          <img
            src="/wickedchatbots.svg"
            alt="Wickedchatbots"
            className="w-[400px]"
          />
        </picture>
      </div>
      <div className="flex justify-evenly items-center">
        <ul className="list-none flex justify-evenly">
          {navList.map((nav, index) => (
            <li key={index}>
              <a
                href={nav.path}
                className="px-5 hover:text-[#4840C9] hover:underline font-semibold"
              >
                {nav.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <button className="px-[12px] py-2 border border-[#4840C9] mr-5 hover:shadow-lg hover:shadow-[#6662a5]">
            Login
          </button>
          <button className="px-[12px] py-2 bg-[#4840C9] flex items-center hover:shadow-lg hover:shadow-[#6662a5]">
            <span>Request A Demo</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="rgba(255,255,255,1)"
                className="mt-[4px] ml-[4px]"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
