from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import User
from apps.applications.models import Application
from apps.candidates.models import CandidateProfile
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = "Create repeatable fictional Driver Hub demo accounts and marketplace data."

    @transaction.atomic
    def handle(self, *args, **options):
        admin = self._user("Demo Admin", "admin.demo@driverhub.test", User.Role.ADMIN, "DemoAdmin123!", phone="0000000000")
        admin.is_staff = True
        admin.is_superuser = True
        admin.save(update_fields=["is_staff", "is_superuser"])

        candidate_specs = [
            ("Demo Candidate", "candidate.demo@driverhub.test", "Bengaluru", 4, "Highway Driving, GPS, Route Planning", "LMV"),
            ("Arjun Rao", "arjun.rao@driverhub.test", "Hyderabad", 7, "Heavy Vehicles, Fleet Safety, Long Haul", "Heavy"),
            ("Meera Nair", "meera.nair@driverhub.test", "Chennai", 3, "City Driving, GPS, Customer Service", "LMV"),
            ("Vikram Singh", "vikram.singh@driverhub.test", "Pune", 6, "Commercial Driving, Fleet Safety", "Commercial"),
            ("Sara Joseph", "sara.joseph@driverhub.test", "Mumbai", 2, "Delivery, GPS, Vehicle Care", "LMV"),
            ("Kabir Shah", "kabir.shah@driverhub.test", "Delhi", 5, "Highway Driving, Heavy Vehicles", "Heavy"),
        ]
        candidates = []
        for name, email, location, years, skills, license in candidate_specs:
            user = self._user(name, email, User.Role.CANDIDATE, "DemoCandidate123!", phone="demo-contact")
            profile, _ = CandidateProfile.objects.get_or_create(user=user)
            profile.location = location
            profile.experience_years = years
            profile.skills = skills
            profile.license_category = license
            profile.bio = f"Fictional demo driver with {years} years of professional experience."
            profile.save()
            candidates.append(profile)

        employer_specs = [
            ("ABC Logistics", "abc.logistics@driverhub.test", "Bengaluru"),
            ("Metro Transport Solutions", "metro.transport@driverhub.test", "Hyderabad"),
            ("SwiftMove Logistics", "swiftmove@driverhub.test", "Chennai"),
            ("CityRide Services", "cityride@driverhub.test", "Pune"),
            ("Prime Fleet Solutions", "prime.fleet@driverhub.test", "Mumbai"),
        ]
        employers = []
        for company, email, location in employer_specs:
            name = f"{company} Hiring"
            user = self._user(name, email, User.Role.EMPLOYER, "DemoEmployer123!", phone="demo-contact")
            profile, _ = EmployerProfile.objects.get_or_create(user=user)
            profile.company_name = company
            profile.company_description = f"{company} is a fictional logistics and transport company for the Driver Hub demo."
            profile.location = location
            profile.phone = "demo-contact"
            profile.save()
            employers.append(profile)

        job_specs = [
            (employers[0], "LMV Delivery Driver", "Bengaluru", "LMV", 2, 22000, 30000, "Day shift", "approved"),
            (employers[0], "Fleet Safety Driver", "Mysuru", "Commercial", 4, 28000, 38000, "Rotational", "approved"),
            (employers[0], "Night Route Driver", "Bengaluru", "LMV", 2, 24000, 32000, "Night shift", "pending"),
            (employers[1], "Heavy Truck Driver", "Hyderabad", "Heavy", 5, 36000, 52000, "Long haul", "approved"),
            (employers[1], "Regional Transport Driver", "Warangal", "Heavy", 3, 30000, 42000, "Day shift", "approved"),
            (employers[1], "Warehouse Shuttle Driver", "Hyderabad", "Commercial", 2, 25000, 33000, "Day shift", "closed"),
            (employers[2], "City Delivery Driver", "Chennai", "LMV", 1, 20000, 28000, "Day shift", "approved"),
            (employers[2], "Port Logistics Driver", "Chennai", "Commercial", 4, 30000, 40000, "Rotational", "approved"),
            (employers[2], "Route Support Driver", "Coimbatore", "LMV", 2, 22000, 30000, "Day shift", "rejected"),
            (employers[3], "CityRide Driver", "Pune", "LMV", 2, 23000, 31000, "Flexible", "approved"),
            (employers[3], "Corporate Shuttle Driver", "Pune", "Commercial", 3, 27000, 36000, "Day shift", "approved"),
            (employers[3], "Weekend Relief Driver", "Mumbai", "LMV", 1, 18000, 24000, "Weekend", "pending"),
            (employers[4], "Fleet Operations Driver", "Mumbai", "Commercial", 5, 34000, 46000, "Rotational", "approved"),
            (employers[4], "Heavy Vehicle Driver", "Nashik", "Heavy", 6, 40000, 58000, "Long haul", "approved"),
            (employers[4], "Local Delivery Driver", "Mumbai", "LMV", 1, 21000, 29000, "Day shift", "approved"),
        ]
        jobs = []
        for employer, title, location, category, experience, minimum, maximum, hours, status in job_specs:
            job, _ = Job.objects.get_or_create(employer=employer, title=title, defaults={"description": f"Fictional demo opportunity for a {title.lower()}.", "driver_category": category, "experience_required": experience, "location": location, "salary_min": Decimal(minimum), "salary_max": Decimal(maximum), "working_hours": hours, "required_documents": ["Driving License", "Resume"], "status": status})
            job.description = f"Fictional demo opportunity for a {title.lower()} with {employer.company_name}."
            job.driver_category, job.experience_required, job.location = category, experience, location
            job.salary_min, job.salary_max, job.working_hours = Decimal(minimum), Decimal(maximum), hours
            job.required_documents, job.status = ["Driving License", "Resume"], status
            job.save()
            jobs.append(job)

        for index in range(24):
            candidate = candidates[index % len(candidates)]
            job = jobs[index % len(jobs)]
            application, _ = Application.objects.get_or_create(job=job, candidate=candidate, defaults={"cover_message": "I am interested in this fictional demo opportunity."})
            application.status = [Application.Status.APPLIED, Application.Status.SHORTLISTED, Application.Status.REJECTED, Application.Status.HIRED][index % 4]
            application.save(update_fields=["status", "updated_at"])

        Notification.objects.filter(type__in=["demo_application", "demo_status"]).delete()
        for index, candidate in enumerate(candidates[:5]):
            Notification.objects.create(user=candidate.user, title="Demo application update", message=f"Your fictional demo application has a new update (#{index + 1}).", type="demo_status")
        for index, employer in enumerate(employers):
            Notification.objects.create(user=employer.user, title="Demo application received", message=f"A fictional candidate applied to one of your demo roles (#{index + 1}).", type="demo_application")

        self.stdout.write(self.style.SUCCESS("Created fictional demo dataset: 6 candidates, 5 employers, 15 jobs, 24 applications, and notifications."))
        self.stdout.write("Candidate: candidate.demo@driverhub.test / DemoCandidate123!")
        self.stdout.write("Employer: employer.demo@driverhub.test / DemoEmployer123! (use the employer.demo account for API verification)")
        self.stdout.write("Admin: admin.demo@driverhub.test / DemoAdmin123!")

    def _user(self, name, email, role, password, phone):
        user, _ = User.objects.get_or_create(email=email, defaults={"name": name, "role": role})
        user.name, user.role, user.phone, user.is_active = name, role, phone, True
        user.set_password(password)
        user.save()
        return user
