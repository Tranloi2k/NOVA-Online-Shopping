"use client";

import { useState } from "react";
import { Icon } from "@/app/ui/nova/nova-icons";

export function NovaNewsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="section">
      <div className="wrap">
        <div className="news flex flex-col items-center justify-center">
          <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)" }}>
            Be first to the next drop.
          </h2>
          <p
            className="muted"
            style={{ fontSize: 16, marginTop: 10, maxWidth: 440 }}
          >
            Early access to launches and members-only pricing. No spam, ever.
          </p>
          <form
            className="news-form"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            {done ? (
              <div className="news-done">
                <Icon name="check" size={18} /> You&apos;re on the list.
              </div>
            ) : (
              <>
                <input
                  className="input"
                  type="email"
                  required
                  placeholder="you@email.com"
                  aria-label="Email"
                />
                <button className="btn btn-dark" type="submit">
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
