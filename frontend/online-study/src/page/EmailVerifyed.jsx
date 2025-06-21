// pages/EmailVerified.jsx
const EmailVerified = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">
          Email Verified!
        </h1>
        <p>You can now log in and access your dashboard.</p>
        <a
          href="/login"
          className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default EmailVerified;
