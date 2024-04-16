import React from "react";

const Footer = () => {
  const FooterColumn: React.FC<{ title: string; items: { name: string; path: string }[] }> = ({ title, items }) => {
    return (
      <div className="flex flex-col">
        <h4 className="font-bold mb-4">{title}</h4>
        <ul className="text-[#6460b6]">
        {items.map((item, index) => (
            <li key={index} className="mb-2">
              <a href={`/${item.path}`}>{item.name}</a>
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
        { name: "Features", path: "features" },
        { name: "Pricing", path: "pricing" },
        { name: "Tour", path: "tour" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Terms of Service", path: "terms-of-service" },
        { name: "Privacy Policy", path: "privacy-policy" },
        { name: "GDPR Policy", path: "gdpr-policy" },
      ],
    },
    {
      title: "Existing Customers",
      items: [{ name: "Login", path: "login" }],
    },
    {
      title: "New Customers",
      items: [{ name: "Request A Demo", path: "request-demo" }],
    },
  ];

  return (
    <footer className="bg-[#1E1B2C] text-white py-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Render each column using FooterColumn component */}
        {columns.map((column, index) => (
          <FooterColumn key={index} title={column.title} items={column.items} />
        ))}
      </div>
      {/* Copyright and Support */}
      <div className="md:w-[80%] flex justify-end mt-8 text-[#6460b6]">
        <p className="text-sm">
          © {new Date().getFullYear()} 24 Ventures Ltd | Support:{" "}
          <a href="mailto:support@aminos.ai" className="underline">support@aminos.ai</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
