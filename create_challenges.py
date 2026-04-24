from CTFd import create_app
from CTFd.utils import db
from CTFd.models import Challenges, Flags, Tags

app = create_app()
with app.app_context():
    challenges_data = [
        {"name": "Scan the Network", "category": "EASY", "description": "Use nmap to find open ports on the target.", "value": 100, "x": 150, "y": 100},
        {"name": "Decode This", "category": "EASY", "description": "Decode this base64 string: c2Vjb3Jh", "value": 100, "x": 363, "y": 100},
        {"name": "SQL Injection", "category": "MEDIUM", "description": "Find the vulnerable login form.", "value": 200, "x": 560, "y": 100},
        {"name": "Buffer Overflow", "category": "HARD", "description": "Exploit the vulnerable binary.", "value": 300, "x": 753, "y": 100},
        {"name": "Hidden Door", "category": "MEDIUM", "description": "Find the secret admin panel.", "value": 250, "x": 350, "y": 380},
    ]
    
    for c in challenges_data:
        challenge = Challenges(
            name=c["name"],
            category=c["category"],
            description=c["description"],
            value=c["value"],
            type="standard",
            state="visible"
        )
        db.session.add(challenge)
        db.session.flush()
        
        flag = Flags(
            challenge_id=challenge.id,
            content="secora{" + c["name"].lower().replace(" ", "_") + "}",
            type="static"
        )
        db.session.add(flag)
        
        tag = Tags(
            challenge_id=challenge.id,
            value="x:" + str(c["x"]) + ",y:" + str(c["y"])
        )
        db.session.add(tag)
        
        print("Created: " + c["name"] + " at x:" + str(c["x"]) + ", y:" + str(c["y"]))
    
    db.session.commit()
    print("\nAll challenges created!")
