# Policy review — 4 October 2026

Sources reviewed: supplied Internal Policy (last edited 2 October 2026), Public Policy, Grammar & Format Guide, and the app catalogue derived from the March 2026 workbook. The newer internal editing policy controls conflicts.

## Corrections
- An omitted vehicle model now produces the selected generic vehicle type for Buying, Selling, Trading and Selling or trading. Supplied unlisted names still fail validation.
- Trades can use a generic target category or an exact catalogue model; exact targets take priority. Trading alone omits Price/Budget.
- Configuration and extras follow policy order; combined turbo/drift wording matches the policy examples.
- Standalone families cannot use property rental modes.
- In city is restricted to house/business ads.
- Private/family businesses and special plates use the policy example articles; singular sim-card wording matches the example.
- Invalid market types fail validation.
- Removed unsupported poker and three-intervening-template guidance from the policy page.

## Review coverage
Reviewed money format/limits, category separation, prohibited items, Auto, Real Estate/families/rentals, Businesses, Other/clothing, quantities/plurals, plates, sim-cards, market stalls, and guidance for Dating, Work, Parties, Services, Discounts, templates, refunds and staff communication.

## Validation
108 explicit format/validation assertions; 24 generic vehicle mode/category combinations; 1,764 named vehicle mode checks; 1,307 single-entry catalogue sweep plus quantity-two item/clothing sweep. Discord access, rejection, reapplication, mail throttling, signed-link expiry/replay and revocation regression tests pass using mocked providers.

## Practical limits
The five existing creators generate Auto, Real Estate, Businesses and Other ads. Work/Dating/party/service/discount sections are guidance, not additional generators. The app does not verify LI approved templates, identity/roles in LI databases, publication history, proof of tradeability, actual market values or punishments. The policy has contextual examples and ambiguous market-price cases that require staff judgment. Passing automated checks does not guarantee every possible ad has no mistakes. Live hosting/email require the owner's configured services.
