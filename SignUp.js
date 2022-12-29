import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

const SignUp = () => {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });
  const [signup, { data, error }] = useMutation(SIGN_UP_MUTATION, {
    variables: inputs,
    // refetch currently logged in user
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // send email and password
    console.log(data);
    await signup().catch(console.error(error));
    resetForm();
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Error error={error} />
      <h2>Sign Up</h2>
      <fieldset>
        {data?.createUser && (
          <p>Signed up with {data.createUser.email} Go and sign in</p>
        )}
        <label htmlFor="name">
          name
          <input
            type="text"
            name="name"
            placeholder="your name"
            value={inputs.name}
            autoComplete="name"
            onChange={handleChange}
          />
        </label>
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

export default SignUp;
