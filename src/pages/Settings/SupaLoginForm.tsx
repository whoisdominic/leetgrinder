import React, { useState } from "react";
import { useAppStore } from "../../state/store";
import { BasicButton } from "../../components/Buttons";

export function SupaLoginForm() {
  const { user, login, logout, signUp } = useAppStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (loginForm.password !== loginForm.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        await signUp(loginForm.email, loginForm.password);
      } else {
        await login(loginForm.email, loginForm.password);
      }
    } catch (err) {
      setError(
        isSignUp
          ? "Sign up failed. Please try again."
          : "Login failed. Please check your credentials."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className="w-full max-w-md mb-6">
      <h3 className="text-lg font-medium mb-3">Account</h3>
      {user ? (
        <div className="bg-gray-800 p-4 rounded mb-4">
          <p className="mb-2">Logged in as: {user.email}</p>
          <BasicButton
            title="Logout"
            onClick={handleLogout}
            disabled={isLoading}
            loading={isLoading}
            color="bg-red-600"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-4">
          {!isSignUp && (
            <p className="text-sm text-gray-400 mb-3">
              Need an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="text-blue-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          )}

          {isSignUp && (
            <p className="text-sm text-gray-400 mb-3">
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="text-blue-400 hover:underline"
              >
                Log in
              </button>
            </p>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={loginForm.confirmPassword}
                onChange={handleLoginChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isLoading
              ? isSignUp
                ? "Signing up..."
                : "Logging in..."
              : isSignUp
              ? "Sign up"
              : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}

export default SupaLoginForm;
