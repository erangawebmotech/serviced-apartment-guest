// middlewares/chain.ts
import { NextRequest, NextResponse } from 'next/server';

export type Middleware = (req: NextRequest) => NextResponse | Promise<NextResponse> | undefined;

export function chain(middlewares: Middleware[]): Middleware {
  return async (req: NextRequest) => {
    for (const middleware of middlewares) {
      const response = await middleware(req);
      if (response) {
        return response;
      }
    }
    return NextResponse.next();
  };
}
