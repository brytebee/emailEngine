import React from "react";

type Props = {
  text: string;
};

const button = ({ text }: Props) => {
  return <div>{text}</div>;
};

export default button;
