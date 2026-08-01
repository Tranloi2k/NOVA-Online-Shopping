import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";
import { LegalPage } from "@/app/ui/legal/legal-page";

// NOTE: Template content — have it reviewed by legal counsel before production.

const UPDATED = "August 1, 2026";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How NOVA collects, uses, and protects your personal data when you shop with us.",
  pathname: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <p>
          This Privacy Policy explains how NOVA (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects, uses, and shares personal data when you
          browse our store, place an order, or contact us. By using NOVA you
          agree to the practices described here.
        </p>
      }
    >
      <section>
        <h2>1. Information we collect</h2>
        <ul>
          <li>
            <strong>Account data</strong> — name, email, and password when you
            register or sign in (including via &ldquo;Sign in with
            Google&rdquo;).
          </li>
          <li>
            <strong>Order &amp; shipping data</strong> — the products you buy,
            shipping address, and contact details. Guests provide this at
            checkout without creating an account.
          </li>
          <li>
            <strong>Payment data</strong> — card payments are processed by
            Stripe. We never see or store full card numbers; we only receive a
            confirmation and limited billing details.
          </li>
          <li>
            <strong>Usage &amp; device data</strong> — pages visited, referring
            links, approximate location, browser and device type, collected via
            cookies and analytics (see our{" "}
            <a href="/cookies">Cookie Policy</a>).
          </li>
          <li>
            <strong>Support messages</strong> — anything you send us or type into
            the shopping assistant.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How we use your data</h2>
        <ul>
          <li>Process and deliver orders, and send order confirmations.</li>
          <li>Provide, secure, and improve the store and your account.</li>
          <li>Respond to support requests and power the shopping assistant.</li>
          <li>Detect fraud, debug errors, and keep the service reliable.</li>
          <li>
            Send service messages and, where permitted, marketing you can opt
            out of at any time.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Who we share it with</h2>
        <p>
          We do not sell your personal data. We share it only with service
          providers who process it on our behalf, including:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong> — payment processing.
          </li>
          <li>
            <strong>Google</strong> — sign-in (OAuth) and analytics
            (Analytics / Tag Manager).
          </li>
          <li>
            <strong>Email provider</strong> — transactional emails such as order
            confirmations.
          </li>
          <li>
            <strong>Error &amp; performance monitoring</strong> — diagnostic data
            to help us fix problems.
          </li>
        </ul>
        <p>
          We may also disclose data when required by law or to protect our rights
          and users.
        </p>
      </section>

      <section>
        <h2>4. Legal bases</h2>
        <p>
          Where the GDPR applies, we process data to perform our contract with
          you (orders and accounts), for our legitimate interests (security and
          improvement), to meet legal obligations, and with your consent (for
          non-essential cookies and marketing).
        </p>
      </section>

      <section>
        <h2>5. Data retention</h2>
        <p>
          We keep personal data for as long as your account is active or as
          needed to provide the service, then for the period required to meet
          legal, tax, and accounting obligations, after which it is deleted or
          anonymised.
        </p>
      </section>

      <section>
        <h2>6. Your rights</h2>
        <p>
          Depending on where you live (e.g. under the GDPR or CCPA), you may have
          the right to access, correct, delete, or export your data, to object to
          or restrict certain processing, and to withdraw consent. To exercise
          these rights, contact us using the details below.
        </p>
      </section>

      <section>
        <h2>7. Security &amp; international transfers</h2>
        <p>
          We use encryption in transit and access controls to protect your data.
          Some providers may process data outside your country; where required we
          rely on appropriate safeguards for those transfers.
        </p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>
          NOVA is not directed to children under 16, and we do not knowingly
          collect their personal data.
        </p>
      </section>

      <section>
        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          posted here with a new &ldquo;Last updated&rdquo; date.
        </p>
      </section>

      <section>
        <h2>10. Contact us</h2>
        <p>
          Questions about privacy? Email{" "}
          <a href="mailto:privacy@novashop.com">privacy@novashop.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
