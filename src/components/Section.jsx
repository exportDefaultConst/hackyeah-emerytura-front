import React from "react";

const Section = ({ children, customClass, title }) => {
  return (
    <section className={`py-12 ${customClass}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
};

export default Section;
