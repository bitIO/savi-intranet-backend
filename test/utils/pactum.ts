import * as pactum from 'pactum';

function setupHandlers() {
  pactum.handler.addCaptureHandler('tokens', (ctx) => {
    return {
      accessToken: ctx.res.body.access_token,
      refreshToken: ctx.res.body.refresh_token,
    };
  });
}

export { setupHandlers };
