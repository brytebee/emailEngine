import * as React from "react";

type Props = {
  firstName: string;
};

const EmailTemplate = ({ firstName }: Props) => {
  return (
    <div>
      <h1 className="bg-red-500">Welcome, {firstName}!</h1>
    </div>
  );
};

export default EmailTemplate;
