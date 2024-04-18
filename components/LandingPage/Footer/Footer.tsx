import React from "react";

const Footer = () => {
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
  const FooterColumn: React.FC<{ title: string; items: { name: string; path: string }[] }> = ({ title, items }) => {
    return (
      <div className="flex flex-col">
        <h4 className="font-bold mb-4 text-gray-700">{title}</h4>
        <ul className="text-[14px]">
        {items.map((item, index) => (
            <li key={index} className="mb-2 hover:underline text-gray-500 hover:text-blue-500 ">
              <a href={`${item.path}`} onClick={handleClick}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Column data
  const columns = [
    {
      title: "Product",
      items: [
        { name: "Features", path: "#features" },
        { name: "Pricing", path: "#pricing" },
        { name: "Tour", path: "#hero" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Terms of Service", path: "https://wickedai.com/terms-of-service" },
        { name: "Privacy Policy", path: "https://wickedai.com/privacy-policy" },
      ],
    },
    {
      title: "Existing Customers",
      items: [{ name: "Login", path: "login" }],
    },
    {
      title: "New Customers",
      items: [{ name: "Request A Demo", path: "#contact" }],
    },
  ];

  return (
    <footer className="text-base py-8 bg-[#ffffff]">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Render each column using FooterColumn component */}
        {columns.map((column, index) => (
          <FooterColumn key={index} title={column.title} items={column.items} />
        ))}
      </div>
      {/* Copyright and Support */}
      <div className="w-[80%] flex justify-end mt-8 text-base text-gray-500">
        <p className="text-sm text-center">
          © {new Date().getFullYear()} 24 Ventures Ltd | Support:{" "}
          <a href="mailto:support@wickedai.com" className="underline hover:text-blue-500">support@wickedai.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
