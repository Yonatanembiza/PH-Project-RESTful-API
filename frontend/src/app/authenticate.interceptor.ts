import { HttpInterceptorFn } from '@angular/common/http';

export const authenticateInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.url);
  req = req.clone({
    // set all requests' headers so that we can make authenticated requests
    headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
  })
  return next(req);
};
