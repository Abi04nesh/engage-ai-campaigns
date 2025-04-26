
import React from "react";
import { Helmet } from "react-helmet-async";
import { TestEmailSender } from "@/components/email/TestEmailSender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Library</CardTitle>
                <CardDescription>Create and manage your email templates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create and manage your email templates here. More features coming soon!
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <TestEmailSender />
          </div>
        </div>
      </div>
    </>
  );
};

export default Templates;
