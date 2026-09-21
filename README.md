# DriverHub

DriverHub is a role-based driver employment platform with a Django REST API, React/Vite web application, and Expo mobile candidate app.

## Architecture

- `backend/`: Django, Django REST Framework, JWT authentication, PostgreSQL models and APIs.
- `web/`: React/Vite web experience for public, candidate, employer, and admin workflows.
- `mobile/`: Expo/React Native candidate experience.
- `docs/`: presentation source and future architecture documentation.

## Backend setup

1. Create PostgreSQL database/user values, then copy `backend/.env.example` to `backend/.env` and replace placeholders.
2. `cd backend`
3. `python -m pip install -r requirements.txt`
4. `python manage.py migrate`
5. `python manage.py seed_demo`
6. `python manage.py runserver`

For isolated checks without PostgreSQL, set `DJANGO_USE_SQLITE=True`. PostgreSQL remains the default runtime database.

## Web and mobile

```powershell
cd web; npm install; npm run dev
cd mobile; npm install; npx expo start
```

Copy each app's `.env.example` before using non-default API URLs. Physical devices must use the development machine's LAN IP rather than `localhost`.

## Demo accounts

- Candidate: `candidate.demo@driverhub.test` / `DemoCandidate123!`
- Employer: `employer.demo@driverhub.test` / `DemoEmployer123!`
- Admin: `admin.demo@driverhub.test` / `DemoAdmin123!`

These accounts are fictional seed data only.

## Verification

```powershell
cd backend
$env:DJANGO_USE_SQLITE='True'
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test apps.accounts.tests apps.accounts.test_phase5 apps.jobs.tests
```

Never commit `.env`, credentials, API keys, private keys, or uploaded user data.
