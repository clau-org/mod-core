# mod-core

## Usage

```ts
// import from own module
import {
  Logger,
  LogLevels,
} from "https://raw.githubusercontent.com/clau-org/mod-core/latest/log/mod.ts";

// import from main module
import { LOG } from "https://raw.githubusercontent.com/clau-org/mod-core/latest/mod.ts";
const { Logger, LogLevels } = LOG;

// import locally
import { Logger, LogLevels } from "../../log/mod.ts";
```