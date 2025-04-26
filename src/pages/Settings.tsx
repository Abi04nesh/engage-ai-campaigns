
import React from "react";
import { Helmet } from "react-helmet";

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings | EngageAI</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        </div>
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Profile Settings</h2>
            <p className="text-muted-foreground">
              Manage your account preferences and settings. Coming soon!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
