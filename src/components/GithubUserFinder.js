import React, { useState } from "react";

const initialMessage = 'No user yet. Try searching for "octocat".';

export default function GithubUserFinder() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleInput = (e) => {
    setUsername(e.target.value);
    setError("");
    setNotFound(false);
  };

  const fetchUser = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      setUser(null);
      setNotFound(false);
      return;
    }
    setError("");
    setNotFound(false);
    setUser(null);
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (res.status === 404) {
        setNotFound(true);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUser();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchUser();
    }
  };

  return (
    <div className="github-card">
      <h2>GitHub User Finder</h2>
      <p className="subtitle">
        Search a GitHub username to see profile details.
      </p>
      <form className="search-form" onSubmit={handleSearch} autoComplete="off">
        <input
          type="text"
          name="username"
          placeholder="e.g. torvalds, gaearon, octocat"
          value={username}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button type="submit">Search</button>
      </form>
      {error && (
        <div className="error-msg">{error}</div>
      )}
      {!user && !error && !notFound && (
        <div className="empty-msg">{initialMessage}</div>
      )}
      {notFound && (
        <div className="error-msg">User not found. Please try again.</div>
      )}
      {user && (
        <div className="user-card">
          <img src={user.avatar_url} alt={user.login} className="avatar" />
          <div className="user-info">
            <h3>
              {user.name ? user.name : ""}
              {user.name && <span> </span>}
              <span className="username">@{user.login}</span>
            </h3>
            <div className="stats">
              <span>{user.public_repos} Repos</span>
              <span>{user.followers} Followers</span>
              <span>{user.following} Following</span>
            </div>
            <div className="details">
              {user.location && <span>Ì≥ç {user.location}</span>}
              {user.twitter_username && (
                <span>
                  &nbsp;Ì∞¶ @{user.twitter_username}
                </span>
              )}
              {user.blog && user.blog !== "" && (
                <span>
                  &nbsp;Ì¥ó <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">{user.blog}</a>
                </span>
              )}
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              View on GitHub
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
