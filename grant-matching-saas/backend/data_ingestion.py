from app import app, db, Grant
from datetime import datetime, timedelta
import random

def ingest_sample_data():
    with app.app_context():
        # Clear existing grants
        Grant.query.delete()

        # Sample data
        agencies = [
            "National Science Foundation",
            "Department of Energy",
            "National Institutes of Health",
            "Department of Defense",
            "Environmental Protection Agency"
        ]

        grant_titles = [
            "Advanced Research in Artificial Intelligence",
            "Renewable Energy Innovation",
            "Cancer Research and Treatment",
            "Cybersecurity Enhancement Program",
            "Climate Change Mitigation Strategies",
            "STEM Education Initiative",
            "Quantum Computing Breakthroughs",
            "Sustainable Agriculture Practices",
            "Mental Health Services Improvement",
            "Space Exploration Technologies"
        ]

        # Generate 50 sample grants
        for i in range(50):
            title = random.choice(grant_titles)
            agency = random.choice(agencies)
            due_date = datetime.now() + timedelta(days=random.randint(30, 365))
            funding_amount = f"${random.randint(100, 1000) * 1000:,}"

            new_grant = Grant(
                title=title,
                agency=agency,
                due_date=due_date,
                funding_amount=funding_amount
            )
            db.session.add(new_grant)

        db.session.commit()
        print("Sample data ingested successfully.")

if __name__ == "__main__":
    ingest_sample_data()