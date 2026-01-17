const credentials = {
  email: 'laddernest@email.com',
  password: 'ayush'
};

console.log('Testing admin login with credentials:', {
  email: credentials.email,
  password: '***'
});

// Test the login
fetch('http://localhost:3001/api/auth/callback/credentials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    email: credentials.email,
    password: credentials.password,
    redirect: 'false'
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});
