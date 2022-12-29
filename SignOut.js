import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

export const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    endSession
  }
`;

const SignOut = () => {
  const [endSession] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }], // this fetch the user again and that produces another render in the components
  });

  const handleSignOut = async () => {
    await endSession();
  };

  return (
    <button type="button" onClick={handleSignOut}>
      SignOut
    </button>
  );
};

export default SignOut;
