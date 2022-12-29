import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  const token = query?.token;

  if (!token) {
    return (
      <div>
        <p>You must supply a token</p>
        <RequestReset />
      </div>
    );
  }

  return (
    <div>
      <p>Reset your password {token}</p>
      <Reset token={token} />
    </div>
  );
}
