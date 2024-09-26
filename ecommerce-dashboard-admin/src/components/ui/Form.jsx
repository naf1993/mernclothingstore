import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: #fff;
      border: 1px solid #f3f4f6;
      border-radius: 7px;
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      padding: 1rem 1rem;

      /* Box */

      background-color: #fff;

      width: 40rem;
      max-height: 500px; /* Set maximum height */
    `}
    
  overflow: hidden;
  font-size: 1.2rem;
`;

Form.defaultProps = {
  type: "modal",
};

export default Form;
