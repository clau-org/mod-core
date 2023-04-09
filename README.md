# mod-core

## Usage

```ts
// import from own module
import {
  Logger,
  LogLevels,
} from "https://deno.land/x/mod_core/log/mod.ts";

// import from main module
import { LOG } from "https://deno.land/x/mod_core/log/mod.ts";
const { Logger, LogLevels } = LOG;
```