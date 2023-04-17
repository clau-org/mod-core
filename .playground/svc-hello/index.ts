import { service } from "./main.ts";
export default {
  async fetch(request: Request, env: any) {
    try {
      const { oakApp } = service;
      return oakApp.handle(request);
    } catch (e) {
      return new Response(e.message);
    }
  },
};
