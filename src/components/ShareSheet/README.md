---
name: Share sheet
category: Actions
platforms:
  - android
  - ios
keywords:
  - sharing
  - intent
  - activity view
  - share extension
  - UIActivityView
  - share action
  - ShareActionProvider
  - android
  - ios
---

# Share sheet

Use share sheet to provide an easy way for merchants to share information from current context with mobile apps and services. It also allows custom actions like copying links, saving images, and bookmarking.

---

## Best practices

Share sheets should:

- Use the share sheets provided by the operating system (OS).
- Use relevant actions to the context. For example, if you're looking at an image provide an action like saving image, not actions like “add to read list”.
- Dismiss share sheet when the merchant has completed their action.
- Trigger the share sheet from familiar [icons](components/images-and-icons/icon).

---

## Content guidelines

### Title

- Descriptive: Help merchants understand what they’ll find in the card
- Concise and scannable:
  - Use short titles since they might get truncated. Put the most important content first.
  - Use simple, clear language that can be read at a glance.
  - Keep titles to single sentence and avoid using punctuation such as
    periods, commas, or semicolons.
  - Where possible, avoid articles (the, a, an) to keep content short and
    actionable.
  - Written in sentence case.
- Informative: They should label the type of content grouped in the body content below.

<!-- usagelist -->

#### Do

- Save image
- Copy
- Bookmark

#### Don’t

- Download the image
- Copy link to clipboard
- Add product as bookmark

<!-- end -->

---

## Examples

### Default share sheet

Use for sharing many types of content. For example images, text, links, phone numbers, emails, and mixed media. The share sheet will show different relevant apps depending on the content.

<!-- content-for: android -->

![Share sheet for Android](components/ShareSheet/android/default.png)

<!-- /content-for -->

<!-- content-for: ios -->

![Share sheet for iOS](components/ShareSheet/ios/default.png)

<!-- /content-for -->

---

## Related components

- The action to trigger the share sheet is often a [button](components/actions/button) or placed inside a [popover](components/overlays/popover).
- If there is only one sharing option, consider showing a more customized interface instead of a share sheet. For example, to share a link, show a [modal](components/overlays/modal) dialog containing the link text and a way to copy the link.
