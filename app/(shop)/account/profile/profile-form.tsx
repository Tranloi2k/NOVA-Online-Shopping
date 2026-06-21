"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/app/lib/services/user";
import { revalidateUserProfile } from "@/app/lib/actions";

interface ProfileFormProps {
  initialUser: {
    id: number;
    username: string;
    email: string;
  };
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUser.username);
  const [email, setEmail] = useState(initialUser.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const payload: { username?: string; email?: string; password?: string } = {
      username: username.trim(),
      email: email.trim(),
    };

    if (password) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      payload.password = password;
    }

    setLoading(true);

    try {
      const res = await updateUser(payload);

      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess("Profile updated successfully!");
        setPassword("");
        setConfirmPassword("");
        // Invalidate Next.js cache so layout updates headers
        await revalidateUserProfile(initialUser.id);
        // Refresh the router to update values
        router.refresh();
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--r-sm)", background: "#ffe9e7", color: "var(--sale)", fontSize: 14, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--r-sm)", background: "#e8f8f0", color: "var(--good)", fontSize: 14, fontWeight: 600 }}>
          {success}
        </div>
      )}

      <div className="field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>

      <hr className="divider" style={{ marginBlock: 10 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700 }}>Security</h4>
        <p className="muted" style={{ fontSize: 13 }}>Leave blank if you do not want to change your password.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <div className="field">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ minWidth: 150 }}
        >
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <svg
                style={{
                  animation: "spin 1s linear infinite",
                  width: 16,
                  height: 16,
                  color: "white"
                }}
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }} />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
