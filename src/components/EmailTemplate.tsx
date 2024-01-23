import * as React from "react";

type Props = {
  firstName: string;
  product: string;
};

const EmailTemplate = ({ firstName, product }: Props) => {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <p>
        The last few deys have seen alot of work from our top notch developers.
      </p>
      <h3>Upcoming updates</h3>
      <p>
        In the coming weeks we would revolutionize how tech education is
        delivered in the country, the continent and globally.
      </p>
      <hr />
      copyright @{product} 2024.
    </div>
  );
};

export default EmailTemplate;
