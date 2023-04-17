export default {
  async fetch(request: Request, env: any) {
    try {
      return new Response("Hello, World!");
    } catch (e) {
      return new Response(e.message);
    }
  },
};
