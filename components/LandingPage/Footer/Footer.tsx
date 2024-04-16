import React from "react";

const Footer = () => {
  const FooterColumn: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
    return (
      <div className="flex flex-col">
        <h4 className="text-md font-bold mb-4">{title}</h4>
        <ul className="text-[#6460b6]">
          {items.map((item, index) => (
            <li key={index} className="mb-2 hover:underline">
              <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>{item}</a>
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
      items: ["Features", "Pricing", "Tour"],
    },
    {
      title: "Legal",
      items: ["Terms of Service", "Privacy Policy", "GDPR Policy"],
    },
    {
      title: "Existing Customers",
      items: ["Login"],
    },
    {
      title: "New Customers",
      items: ["Request A Demo"],
    },
  ];

  return (
    <footer className="bg-[#1E1B2C] text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Render each column using FooterColumn component */}
        {columns.map((column, index) => (
          <FooterColumn key={index} title={column.title} items={column.items} />
        ))}
      </div>
      {/* Copyright and Support */}
      <div className="text-center mt-8 text-[#6460b6]">
        <p className="text-sm">
          © {new Date().getFullYear()} 24 Ventures Ltd | Support:{" "}
          <a href="mailto:support@aminos.ai" className="underline">support@aminos.ai</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
