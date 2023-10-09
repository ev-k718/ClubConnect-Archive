import app from './app';

const port = process.env.PORT || 5050;

app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`HOPCC API: http://localhost:${port}/`);
  }
});
