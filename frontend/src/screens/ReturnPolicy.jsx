import React from "react";

const ReturnPolicy = () => {
  const returnPolicyContent = `
  We offer a 30-day return policy on all items. Items must be returned unused, in their original packaging, and in the condition they were received.
  Please contact us at returns@example.com to initiate a return request.
`;
  return (
    <div className="page-container">
      <div className="return-policy-wrapper">
        <h1>Return Policy</h1>
        <p>{returnPolicyContent}</p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
