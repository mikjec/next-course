import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth; //przekazujemy nasz authCofngi do next-auth i eksportujemy funkcję .atuh ktora staje się naszym middleware
 
export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], //to wylacza sciezki z middleware, inaczej middleware uruchamialby sie dla kazdego pliku na serwerze, tutaj zostaej wyklczone api, _next/static, _next/image oraz wszystkie pliki png
};