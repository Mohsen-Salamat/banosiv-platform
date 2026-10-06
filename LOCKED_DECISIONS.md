# LOCKED_DECISIONS.md
version: "1.0"
status: "LOCKED_WITH_ASSUMPTIONS"

> Phase 0 decisions below are registered assumptions because no completed discovery questionnaire was supplied. P0 financial/legal choices remain reversible until explicitly approved.

| Field | Decision | Status | Rationale |
|---|---|---|---|
| business.type | Physical E-commerce | ASSUMED | Matches the baseline commerce/order/payment scope. |
| business.name | BANOSIV | ASSUMED | Matches the supplied brand reference. |
| business.market_target | Iran + International | ASSUMED | Supports both Zarinpal and Stripe branches. |
| business.primary_language | en | ASSUMED | Safer default for initial engineering surface; RTL remains supported by architecture. |
| business.default_theme | dark | ASSUMED | Consistent with the supplied BANOSIV visual direction. |
| currency.storage_unit | integer minor unit | LOCKED | Required by source spec. |
| currency.display_unit | GBP | ASSUMED | No explicit business currency was provided. |
| currency.multi_currency_display | false | ASSUMED | Avoids unimplemented FX behavior in Thin Slice. |
| auth.methods | email/password | ASSUMED | Lowest-risk Thin Slice method. |
| auth.guest_checkout | false | ASSUMED | Guest checkout needs a separate identity/cart workflow. |
| auth.two_factor | none | ASSUMED | Optional in source spec; not needed for Thin Slice. |
| payment.providers | ZARINPAL + STRIPE | ASSUMED | Both provider branches are preserved for architecture validation. |
| payment.mode_default | sandbox | LOCKED | Prevents accidental live financial activity. |
| features.chat | true | ASSUMED | Selected for full project scope; implementation deferred to Module 5. |
| features.ticket_system | true | ASSUMED | Selected for support continuity. |
| features.blog | true | ASSUMED | Owner-content scope selected. |
| features.reviews | false | ASSUMED | Deferred until business need is confirmed. |
| features.discount_codes | true | ASSUMED | Commerce requirement selected for Module 6. |
| features.gift_cards | false | ASSUMED | Deferred. |
| features.loyalty_program | false | ASSUMED | Deferred. |
| features.pwa | false | ASSUMED | P2; deferred. |
| features.web_push | false | ASSUMED | P2; deferred. |
| features.splash_3d | false | ASSUMED | P2; deferred for performance safety. |
| compliance.gdpr | true | ASSUMED | EU users are in selected market scope. |
| compliance.cookie_consent | true | ASSUMED | Follows GDPR assumption. |
| compliance.vat_enabled | false | ASSUMED | Legal tax rates were not supplied. |
| compliance.tax_zone_eu | true | ASSUMED | EU users selected, but calculation remains a later module. |
| analytics.provider | none | ASSUMED | Avoid third-party tracking before consent/legal configuration. |
| timezone.business_default | Europe/London | ASSUMED | User operating timezone context; stored in UTC. |
| timezone.user_auto_detect | true | ASSUMED | Presentation convenience; never affects DB timestamps. |
| hosting.target | Railway | USER_REQUEST | Explicit platform choice. |
| storage.s3_provider | AWS S3 / MinIO abstraction | ASSUMED | Baseline architecture. |
| changelog | all post-lock changes require impact + approval | LOCKED | Direct source rule. |

## Promotion / Deferment rule

A selected P2 feature becomes active project scope and is recorded here before implementation. Deferred P0/P1 items remain preserved in `PRESERVATION.md` and `PROGRESS.md`.
