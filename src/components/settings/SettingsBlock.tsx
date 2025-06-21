import React from "react";

export default function SettingsBlock({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
} 