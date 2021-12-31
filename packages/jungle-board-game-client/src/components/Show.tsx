import React from "react";

interface IShowProps {
  when: boolean;
}

const Show: React.FC<IShowProps> = ({ when, children }) => {
  return when ? <>{children}</> : <></>;
};

export default Show;
