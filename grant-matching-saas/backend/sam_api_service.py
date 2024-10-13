import requests
from datetime import datetime

class SAMAPIService:
    BASE_URL = "https://api.sam.gov/opportunities/v2/search"
    
    def __init__(self, api_key):
        self.api_key = api_key

    def search_grants(self, keyword=None, agency=None, posted_date_start=None, posted_date_end=None):
        params = {
            "api_key": self.api_key,
            "limit": 100,
            "postedFrom": posted_date_start.isoformat() if posted_date_start else None,
            "postedTo": posted_date_end.isoformat() if posted_date_end else None,
            "keyword": keyword,
            "agency": agency
        }
        
        response = requests.get(self.BASE_URL, params=params)
        response.raise_for_status()
        
        data = response.json()
        return self._parse_grants(data["opportunitiesData"])

    def _parse_grants(self, opportunities):
        grants = []
        for opp in opportunities:
            grant = {
                "title": opp.get("title"),
                "agency": opp.get("department", {}).get("name"),
                "due_date": datetime.strptime(opp.get("responseDeadLine"), "%Y-%m-%dT%H:%M:%S.%f%z").date() if opp.get("responseDeadLine") else None,
                "funding_amount": opp.get("awardCeiling"),
                "description": opp.get("description"),
                "opportunity_id": opp.get("opportunityId")
            }
            grants.append(grant)
        return grants