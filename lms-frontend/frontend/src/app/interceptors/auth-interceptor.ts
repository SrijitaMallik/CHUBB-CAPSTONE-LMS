import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('AuthInterceptor called for:', req.url);
  
  const token = localStorage.getItem('token');
  console.log('Token found in localStorage:', !!token, token ? token.substring(0, 20) + '...' : 'null');

  if (token) {
    console.log('Cloning request and adding Authorization header');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Request cloned with Authorization header');
  } else {
    console.log('No token found, request will be sent without Authorization header');
  }

  return next(req);
};
