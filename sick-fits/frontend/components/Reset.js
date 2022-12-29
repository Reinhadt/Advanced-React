import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

const Reset = ({ token }) => {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [reset, { data, error }] = useMutation(RESET_MUTATION, {
    variables: { ...inputs },
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // send email and password
    console.log(data);
    await reset().catch(console.error(error));
    resetForm();
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Error error={error || successfulError} />
      <h2>Reset your password</h2>
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && <p>Success</p>}
        <label htmlFor="email">
          email
          <input
            type="email"
            name="email"
            placeholder="your email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="your password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
};

export default Reset;
