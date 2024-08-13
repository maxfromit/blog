DELETE FROM auth.user_roles
WHERE
  ROLE = 'admin';

DELETE FROM auth.users
WHERE
  email = 'admin@repo.catchyname.dev';

DELETE FROM auth.roles
WHERE
  ROLE = 'admin';
