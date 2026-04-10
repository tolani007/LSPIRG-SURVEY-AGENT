"""
Generate people.csv — 10,000 rows of synthetic birth records.

Distribution: ~80.48% Scotland (8048 people), ~19.52% Northern Ireland (1952 people)
This matches the expected sample_output.json: {"Scotland": 8048, "Northern Ireland": 1952}

Run:  python generate_people.py
Out:  people.csv (in the same directory)
"""

import csv
import random
import os
from datetime import date, timedelta

random.seed(42)  # reproducible results

# ── Cities split by country (from places.csv) ──────────────────────────────

SCOTLAND_CITIES = [
    "Aberdeen", "Airdrie", "Alloa", "Annan", "Anstruther", "Arbroath",
    "Ardrossan", "Ayr", "Banff", "Barrhead", "Bathgate", "Bellshill",
    "Blairgowrie", "Brechin", "Bridge of Allan", "Buckie", "Campbeltown",
    "Carluke", "Castle Douglas", "Clydebank", "Coatbridge", "Crieff",
    "Cupar", "Dalbeattie", "Dalkeith", "Dalry", "Dingwall", "Dufftown",
    "Dumbarton", "Dumfries", "Dundee", "Dunfermline", "Edinburgh", "Elgin",
    "Falkirk", "Forfar", "Forres", "Fraserburgh", "Galashiels", "Glasgow",
    "Golspie", "Grantown-on-Spey", "Greenock", "Haddington", "Hamilton",
    "Hawick", "Helensburgh", "Huntly", "Invergordon", "Inverness", "Irvine",
    "Jedburgh", "Keith", "Kelso", "Kilmarnock", "Kilsyth", "Kinross",
    "Kirkcaldy", "Kirkintilloch", "Kirkwall", "Kirriemuir", "Lanark",
    "Langholm", "Lerwick", "Leven", "Linlithgow", "Lockerbie", "Milngavie",
    "Montrose", "Motherwell", "Musselburgh", "Nairn", "Newton Stewart",
    "Oban", "Paisley", "Peebles", "Perth", "Peterhead", "Port Glasgow",
    "Portsoy", "Rothesay", "Selkirk", "St Andrews", "Stirling", "Stonehaven",
    "Stornoway", "Stranraer", "Thurso", "Tillicoultry", "West Calder",
    "Wick", "Wishaw",
]

NI_CITIES = [
    "Armagh", "Ballymena", "Ballymoney", "Banbridge", "Bangor", "Belfast",
    "Carrickfergus", "Coleraine", "Cookstown", "Downpatrick", "Dromore",
    "Dungannon", "Enniskillen", "Larne", "Lisburn", "Londonderry", "Lurgan",
    "Newry", "Newtownards", "Omagh", "Portadown", "Strabane",
]

# ── Name pools ──────────────────────────────────────────────────────────────

GIVEN_NAMES = [
    "John", "James", "Robert", "William", "David", "George", "Thomas",
    "Charles", "Edward", "Henry", "Albert", "Arthur", "Frederick", "Joseph",
    "Samuel", "Richard", "Peter", "Andrew", "Christopher", "Michael",
    "Patrick", "Daniel", "Hugh", "Alexander", "Kenneth", "Donald", "Ian",
    "Colin", "Alan", "Ronald", "Leonard", "Norman", "Stanley", "Sidney",
    "Harold", "Amos", "Philip", "Steven", "Jonathan", "Sean", "Jose",
    "Mary", "Elizabeth", "Margaret", "Dorothy", "Grace", "Lily", "Edith",
    "Florence", "Alice", "Agnes", "Helen", "Catherine", "Jane", "Sarah",
    "Anne", "Susan", "Janet", "Jean", "Mabel", "Josephine", "Nancy",
    "Sheila", "Thirza", "Kathleen", "Elsie", "Ruth", "Betty", "Ethel",
    "Doris", "Iris", "Gladys", "Muriel", "Hilda", "Violet", "Olive",
    "Nellie", "Ada", "Winifred", "Beatrice",
]

FAMILY_NAMES = [
    "Smith", "Brown", "Wilson", "Campbell", "Stewart", "Thomson", "Robertson",
    "Anderson", "MacDonald", "Scott", "Reid", "Murray", "Taylor", "Clark",
    "Ross", "Young", "Mitchell", "Watson", "Morrison", "Paterson", "Walker",
    "Fraser", "Henderson", "Hamilton", "Graham", "Kerr", "Simpson", "Hunter",
    "Duncan", "Crawford", "Ferguson", "Bell", "Grant", "Gordon", "Black",
    "Burns", "Allan", "Johnston", "Marshall", "Watt", "Stevenson", "Wood",
    "Gray", "Milne", "Craig", "Munro", "Ritchie", "Douglas", "McKay",
    "Findlay", "Martin", "Kennedy", "Cunningham", "Sinclair", "Wright",
    "Wallace", "Hay", "Bruce", "Duff", "Millar", "Currie", "Williamson",
    "Doyle", "Williams", "Jeffery", "Molnar", "Styles", "Barth", "Beetham",
    "Cash", "Rogerson", "Helm", "Venters", "Hyam", "Hutchinson", "Clements",
    "Bentham", "Humphreys", "Chandler", "Hetherington", "Hopkins", "Shaw",
    "Mclaughlan", "Jones", "Joynson", "Denton", "Penney", "Norman", "Wallis",
    "Ghillyer", "Bennett", "Dixon", "Booth", "Latham", "Farrow", "Renshaw",
]


def random_date(start_year=1840, end_year=1990):
    """Generate a random date between start_year and end_year."""
    start = date(start_year, 1, 1)
    end = date(end_year, 12, 31)
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))


def generate_people_csv(output_path, total=10000, scotland_count=8048):
    """Generate people.csv with the exact Scotland/NI distribution."""
    ni_count = total - scotland_count

    rows = []

    # Generate Scotland births
    for _ in range(scotland_count):
        rows.append({
            "given_name": random.choice(GIVEN_NAMES),
            "family_name": random.choice(FAMILY_NAMES),
            "date_of_birth": random_date().isoformat(),
            "place_of_birth": random.choice(SCOTLAND_CITIES),
        })

    # Generate Northern Ireland births
    for _ in range(ni_count):
        rows.append({
            "given_name": random.choice(GIVEN_NAMES),
            "family_name": random.choice(FAMILY_NAMES),
            "date_of_birth": random_date().isoformat(),
            "place_of_birth": random.choice(NI_CITIES),
        })

    # Shuffle so the data isn't sorted by country
    random.shuffle(rows)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["given_name", "family_name", "date_of_birth", "place_of_birth"]
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"Generated {total} rows -> {output_path}")
    print(f"  Scotland:         {scotland_count}")
    print(f"  Northern Ireland: {ni_count}")


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(script_dir, "people.csv")
    generate_people_csv(output)
