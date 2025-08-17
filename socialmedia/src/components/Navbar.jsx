/*summary of navbar functionality
 💻 Responsive — works on desktop and mobile.
👥 User-aware — shows login/logout depending on whether the user is logged in.
✨ Styled with Tailwind CSS — fast and clean UI setup.
🔒 Uses AuthContext — securely handles login/logout from GitHub.
🧭 Uses React Router — for smooth page changes without reload.*/

import { useState } from "react"; /*useState is a React hook for managing state (in this case, the open/close status of the mobile menu).*/
import { Link } from "react-router"; /*Link is used to navigate between pages in your app without reloading the browser.Example: <Link to="/create"> means go to /create when clicked.*/
import { useAuth } from "../context/AuthContext"; /*This is your custom hook from AuthContext.
It gives access to:
signInWithGitHub – to log in
signOut – to log out
user – the currently logged-in user info*/
export const Navbar = () => {
  const [menuOpen, setMenuOpen] =
    useState(
      false
    ); /*This is React state.It keeps track of whether the mobile menu is open or not (true or false).*/
  const { signInWithGitHub, signOut, user } = useAuth(); /*Pulls out:
  signInWithGitHub() – function to log in
  signOut() – function to log out
  user – the user object (if logged in)*/

  const displayName =
    user?.user_metadata?.user_name ||
    user?.email ||
    "Guest"; /*This picks the best available display name:GitHub username (if exists) OR email OR "Guest" if not logged in*/
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-sky-400">
            Nexora<span className="text-green-400">.app</span>
          </Link>
          {/*The logo/title of your app.Clicking it sends the user to the homepage (/). */}

          {/*Desktop Link*/}
          {/*This section is hidden on mobile, only shown on md (medium) and up.Displays 4 navigation links. */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Community
            </Link>
          </div>
          {/* Desktop  Auth*/}
          {/*Shows GitHub avatar, name, and "Sign Out" button if logged in.Else, shows a "Sign In with GitHub" button.*/}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300"> {displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  {" "}
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                {" "}
                Sign In With Github
              </button>
            )}
          </div>
          {/* Moblie Menu button */}
          {/*On mobile (md:hidden), a button shows up.Clicking it toggles the mobile menu between open and closed.
          Shows:
          Hamburger icon when closed
          X icon when open*/}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/*Mobile Menu*/}
      {/*When menuOpen is true, show vertical mobile menu.It has the same links as desktop.*/}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
