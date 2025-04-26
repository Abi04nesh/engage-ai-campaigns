
import React from "react";
import { Helmet } from "react-helmet";

const Templates = () => {
  return (
    <>
      <Helmet>
        <title>Templates | EngageAI</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        </div>
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Template Library</h2>
            <p className="text-muted-foreground">
              Create and manage your email templates here. Coming soon!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Templates;
