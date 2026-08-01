import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";
import { LegalPage } from "@/app/ui/legal/legal-page";

// NOTE: Template content — have it reviewed by legal counsel before production.

const UPDATED = "August 1, 2026";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description:
    "What cookies NOVA uses, why we use them, and how you can control them.",
  pathname: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated={UPDATED}
      intro={
        <p>
          This Cookie Policy explains how NOVA uses cookies and similar
          technologies. For how we handle personal data more broadly, see our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      }
    >
      <section>
        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They let a site remember your actions and preferences (such as
          staying signed in) and help us understand how the store is used.
        </p>
      </section>

      <section>
        <h2>2. Types of cookies we use</h2>
        <ul>
          <li>
            <strong>Strictly necessary</strong> — required for the site to work,
            including keeping you signed in and securing your session. These
            cannot be switched off.
          </li>
          <li>
            <strong>Analytics</strong> — help us measure traffic and improve the
            store. These are optional and only used where permitted.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Cookies on this site</h2>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Session &amp; auth tokens</td>
              <td>Keep you signed in and protect your account (NextAuth).</td>
              <td>Necessary</td>
            </tr>
            <tr>
              <td>Cart / preferences</td>
              <td>Remember your basket and site preferences.</td>
              <td>Necessary</td>
            </tr>
            <tr>
              <td>_ga, _gid</td>
              <td>Google Analytics — measure visits and usage.</td>
              <td>Analytics</td>
            </tr>
            <tr>
              <td>Google Tag Manager</td>
              <td>Loads and manages analytics tags.</td>
              <td>Analytics</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. Managing cookies</h2>
        <p>
          Most browsers let you view, block, or delete cookies through their
          settings. Blocking strictly necessary cookies may stop parts of the
          store from working, such as signing in or checking out. You can also
          opt out of Google Analytics using Google&rsquo;s browser add-on.
        </p>
      </section>

      <section>
        <h2>5. Third-party cookies</h2>
        <p>
          Some cookies are set by third parties such as Google (analytics) and
          Stripe (payment and fraud prevention during checkout). Their use of
          data is governed by their own privacy policies.
        </p>
      </section>

      <section>
        <h2>6. Changes &amp; contact</h2>
        <p>
          We may update this Cookie Policy as our practices change. Questions?
          Email <a href="mailto:privacy@novashop.com">privacy@novashop.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
