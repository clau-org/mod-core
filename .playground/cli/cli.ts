import { defineCommandLineInterface } from "./deps.ts";
import commandHello from "./commands/hello/index.ts";

export default await defineCommandLineInterface({ commands: [commandHello] });
