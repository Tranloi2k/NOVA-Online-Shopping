import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";
import { LegalPage } from "@/app/ui/legal/legal-page";

// NOTE: Template content — have it reviewed by legal counsel before production.

const UPDATED = "August 1, 2026";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of the NOVA store and your purchases.",
  pathname: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated={UPDATED}
      intro={
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the NOVA store. By browsing, creating an account, or placing an
          order you agree to these Terms. Please read them carefully.
        </p>
      }
    >
      <section>
        <h2>1. Eligibility</h2>
        <p>
          You must be at least 18 years old, or the age of majority where you
          live, to place an order. By using NOVA you confirm that the information
          you provide is accurate and that you are legally able to enter into
          this agreement.
        </p>
      </section>

      <section>
        <h2>2. Your account</h2>
        <p>
          You are responsible for keeping your login credentials confidential and
          for all activity under your account. You may also check out as a guest
          without an account. Notify us promptly of any unauthorised use.
        </p>
      </section>

      <section>
        <h2>3. Products, pricing &amp; availability</h2>
        <ul>
          <li>
            We aim to describe products and prices accurately, but errors can
            occur. Prices and availability may change without notice.
          </li>
          <li>
            If a product is listed at an incorrect price or is unavailable after
            you order, we may cancel the order and refund any amount charged.
          </li>
          <li>All prices are shown in US dollars unless stated otherwise.</li>
        </ul>
      </section>

      <section>
        <h2>4. Orders &amp; payment</h2>
        <p>
          Placing an order is an offer to buy. Your order is confirmed once
          payment succeeds. Payments are processed securely by Stripe; by paying
          you also agree to Stripe&rsquo;s terms. Applicable taxes and shipping
          fees are shown before you confirm.
        </p>
      </section>

      <section>
        <h2>5. Shipping, returns &amp; cancellations</h2>
        <p>
          Delivery times are estimates, not guarantees. Risk of loss passes to
          you on delivery. Returns and refunds are handled according to our
          returns process; contact support to start a return or ask about the
          status of an order.
        </p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the store for any unlawful or fraudulent purpose.</li>
          <li>
            Interfere with, disrupt, or attempt to gain unauthorised access to
            the service or its systems.
          </li>
          <li>
            Scrape, resell, or misuse content, or abuse the shopping assistant.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Intellectual property</h2>
        <p>
          The NOVA name, logo, site content, and design are owned by us or our
          licensors and are protected by intellectual property laws. You may not
          use them without our prior written permission.
        </p>
      </section>

      <section>
        <h2>8. Disclaimers</h2>
        <p>
          The store is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, to the fullest extent
          permitted by law. We do not warrant that the service will be
          uninterrupted or error-free.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, NOVA will not be liable for any
          indirect, incidental, or consequential damages. Nothing in these Terms
          limits liability that cannot be excluded under applicable law, such as
          your statutory consumer rights.
        </p>
      </section>

      <section>
        <h2>10. Governing law &amp; changes</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which NOVA
          operates, without regard to conflict-of-laws rules. We may update these
          Terms from time to time; the version posted here with the latest
          &ldquo;Last updated&rdquo; date applies.
        </p>
      </section>

      <section>
        <h2>11. Contact us</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href="mailto:support@novashop.com">support@novashop.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
