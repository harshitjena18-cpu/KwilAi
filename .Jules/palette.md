## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Custom Progress Bar Accessibility
**Learning:** Custom div-based progress components (such as KwilProgress) require explicit ARIA attributes (role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax) and must be linked to their visual labels using aria-labelledby combined with a unique ID to ensure screen reader accessibility.
**Action:** Always ensure custom progress components include these attributes, leveraging React's useId() to generate reliable IDs for aria-labelledby associations.
