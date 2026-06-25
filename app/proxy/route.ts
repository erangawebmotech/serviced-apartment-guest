import { cacheMiddleware } from '@/middlewares/cacheMiddleware';
import { chain } from '@/middlewares/chain';
import type { NextRequest } from 'next/server';

const composedMiddleware = chain([cacheMiddleware]);

const methods = ['GET','POST','PUT','DELETE','PATCH','OPTIONS','HEAD','TRACE','CONNECT'] as const;

methods.forEach((method) => {
  exports[method] = async (req: NextRequest) => composedMiddleware(req);
});
