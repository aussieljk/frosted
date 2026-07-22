<h1 align="center">@aussieljk/frosted</h1>

<p align="center">Frosted UI — a React design system with a themeable component library, SwiftUI-style layout primitives, and pluggable icon sets</p>

<h3 align="center">
  <a href="https://frosted.localhost">Docs</a> -
  <a href="https://storybook.frosted.localhost">Storybook</a>
</h3>

> [!WARNING]
> The design system is still a work in progress so you can expect some breaking changes.

<img width="2270" height="1101" alt="Gray 1" src="https://github.com/user-attachments/assets/abb3b1ca-7445-4438-801c-80bc666b7c54" />

## Getting Started

Install Frosted UI:

```sh
$ bun add @aussieljk/frosted
```

Import the global CSS file at the root of your application:

```tsx
import '@aussieljk/frosted/styles.css';
```

Add the Theme component:

```tsx
import { Theme } from '@aussieljk/frosted';

export default function () {
  return (
    <html>
      <body>
        <Theme>
          <MyApp />
        </Theme>
      </body>
    </html>
  );
}
```

## Acknowledgments

Frosted UI is heavily based on [Radix Themes](https://www.radix-ui.com/) design system and [Radix Icons](https://github.com/radix-ui/icons).
