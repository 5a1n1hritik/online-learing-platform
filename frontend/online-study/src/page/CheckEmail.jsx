// pages/CheckEmail.jsx
const CheckEmail = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center max-w-md space-y-4 p-6 border rounded-lg">
        <h1 className="text-2xl font-bold text-primary">Almost there!</h1>
        <p className="text-gray-600">
          We&apos;ve sent a verification email to your inbox.
          <br />
          Please click the link in that email to verify your account.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or request a new one.
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
