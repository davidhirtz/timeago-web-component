Timeago Web Component
=========

Tiny web component that displays dates as relative timestamps (e.g. "4 minutes ago"). Automatically synchronizes the
elapsed time, supports the browser's language and sets the `title` attribute to the localized full date.

No dependencies, 2.8kb.

### Installation

```bash
npm install x-timeago
```

### Import or include

```js
import 'x-timeago';
```

or

```html
<script src="timeago.min.js"></script>
```

### Usage

```html

<x-timeago date="2025-01-01T00:00:00Z"></x-timeago>
<x-timeago>2025-01-01T00:00:00Z</x-timeago>
```

[View online demo](https://davidhirtz.github.io/timeago-web-component/)