INSERT INTO
  auth.roles (ROLE)
VALUES
  ('admin');

WITH
  users AS (
    INSERT INTO
      auth.users (
        created_at,
        updated_at,
        last_seen,
        disabled,
        display_name,
        avatar_url,
        locale,
        email,
        phone_number,
        password_hash,
        email_verified,
        phone_number_verified,
        new_email,
        otp_method_last_used,
        otp_hash,
        otp_hash_expires_at,
        default_role,
        is_anonymous,
        totp_secret,
        active_mfa_type,
        ticket,
        ticket_expires_at,
        metadata,
        webauthn_current_challenge
      )
    VALUES
      (
        DEFAULT,
        DEFAULT,
        NULL,
        FALSE,
        'admin@repo.catchyname.dev',
        'https://s.gravatar.com/avatar/cbc4c5829ca103f23a20b31dbf953d05?r=g&default=blank',
        'en',
        'admin@repo.catchyname.dev',
        NULL,
        '$2b$10$32/88l2VNnnnlVR9HAAUwOdjyVsQ7xgRNAnzFjdrNT0P0iDj2tCKO', -- deedeb5979e
        TRUE,
        FALSE,
        NULL,
        NULL,
        NULL,
        DEFAULT,
        'admin',
        FALSE,
        NULL,
        NULL,
        NULL,
        DEFAULT,
        '{}',
        NULL
      )
    RETURNING
      id
  )
INSERT INTO
  auth.user_roles (user_id, ROLE)
SELECT
  id,
  'admin'
FROM
  users;
