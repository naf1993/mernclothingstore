import styled from "styled-components";

const Form = styled.form`
  background-color: ${({ theme }) => theme.palette.primary.main};
  width: 90%; /* Responsive width */
  max-width: 600px; /* Limit max width */
  max-height: 80vh; /* Responsive max height */
  overflow-y: auto; /* Allow scrolling if content exceeds height */
  border-radius: 8px;
   /* Add padding for spacing */
  font-size: 1.2rem;
   /* Base font size */
  
  @media (max-width: 768px) {
    font-size: 1rem; /* Adjust font size for medium screens */
   /* Adjust padding for medium screens */
  }

  @media (max-width: 480px) {
    font-size: 0.9rem; /* Further adjust font size for small screens */
    /* Reduce padding for small screens */
  }
`;

export default Form;
