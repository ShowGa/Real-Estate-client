import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ErrorMessage = () => {
  const { error } = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      {visible && error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default ErrorMessage;
