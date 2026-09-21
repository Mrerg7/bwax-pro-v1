interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const APEX_HOST = 'bwax.pro';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    let changed = false;

    if (hostname === `www.${APEX_HOST}`) {
      url.hostname = APEX_HOST;
      changed = true;
    }

    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      changed = true;
    }

    if (changed) {
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    if (hostname.endsWith('.workers.dev') || hostname.endsWith('.pages.dev')) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
