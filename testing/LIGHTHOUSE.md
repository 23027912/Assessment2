Lighthouse Accessibility Audit — RSS Client
The brief wants: run Lighthouse, show the results in the video, explain what you changed
because of it, and discuss how the results influenced the final design.
1. Run it
Easiest path — Chrome DevTools, no install needed:
Open the frontend in Chrome (`http://localhost:3000` or your EC2 IP)
Open DevTools (`F12`) → Lighthouse tab
Check Accessibility (uncheck the others unless you also want Performance/SEO/Best
Practices scores — fine to include, just not required)
Choose Navigation mode, device type doesn't matter much for accessibility
Click Analyze page load
Repeat for each page: `/`, `/feeds`, `/about`, `/settings`, `/dashboard`
Alternative — CLI, useful if you want a saved HTML report per page:
```bash
npm install -g lighthouse
lighthouse http://localhost:3000/feeds --only-categories=accessibility --view
```
2. What Lighthouse actually checks
For accessibility specifically, it flags things like: missing alt text on images,
insufficient colour contrast, form inputs without labels, missing ARIA attributes,
non-descriptive link/button text, and heading order.
This app already has a head start on several of these — worth checking that Lighthouse
actually detects them working correctly, not just assuming:
`aria-expanded` / `aria-controls` on the hamburger menu, kebab dropdown, and the
feed form's hide/show toggle
`role="radiogroup"` and `role="switch"` on the Settings page controls
`aria-label` on icon-only buttons (menu toggles, edit/delete on feed cards)
Keyboard-focusable feed card actions (not hover-only — see `focus-within` classes
in `FeedCard.tsx`)
Semantic `<nav aria-label="...">` regions for the navbar, breadcrumbs, and mobile menu
3. Likely findings worth checking for real
Don't assume these are fine — actually check them, since some are easy to miss:
Image alt text — `FeedCard.tsx` renders `<img alt="" />` for feed thumbnails.
Empty alt is only correct if the image is purely decorative; since these images
represent the feed content, Lighthouse may flag this — consider using the feed
title as alt text instead.
Colour contrast — the `muted` text colour (`#8b958f` dark theme, `#6a7268` light
theme) against the background is deliberately subdued for a "wire service" look.
Worth checking this against WCAG AA (4.5:1 for normal text) with Lighthouse or a
contrast checker — it may need darkening slightly in light mode.
Video without captions — the About page's embedded video has no captions/
transcript. Lighthouse may or may not flag this depending on audit version, but
it's a real accessibility gap worth mentioning even if not flagged.
Custom `<select>` / dropdown styling — the feed status `<select>` in `FeedForm.tsx`
is a native element (good — keeps built-in keyboard/screen-reader behaviour), but
confirm it still has a visible focus outline in your final theme.
4. Write-up template (for the video / submission)
Fill in after actually running the audits:
Page	Score (before)	Key issues found	Fix applied	Score (after)
`/`				
`/feeds`				
`/dashboard`				
`/about`				
`/settings`				
Changes made as a result of the audit:
(e.g. "Changed feed thumbnail alt text from empty string to the feed title")
(e.g. "Increased muted text contrast ratio in light mode from X:1 to Y:1")
How this influenced the final design:
A short paragraph — e.g. explaining that the monospace/muted colour aesthetic was
adjusted where it conflicted with contrast requirements, or that hover-only actions
were deliberately made keyboard-accessible from the start because of prior Lighthouse
experience, etc. This is the "discuss how results influenced final design" part the
brief explicitly asks for — don't skip it, a table of scores alone won't satisfy that.