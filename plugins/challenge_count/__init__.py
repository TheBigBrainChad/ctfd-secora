from flask import jsonify
from CTFd.models import Challenges, Teams, Users, Solves
from CTFd.utils import get_config

def load(app):
    @app.context_processor
    def inject_secora_stats():
        try:
            chal_count = Challenges.query.filter_by(state='visible').count()
        except:
            chal_count = 0
            
        try:
            # By default, use individual physical users to represent Crewmates
            crew_count = Users.query.filter_by(hidden=False, banned=False).count()
        except:
            crew_count = 0
            
        try:
            ctf_end = get_config('ctf_end')
        except:
            ctf_end = None
            
        return dict(
            public_challenge_count=chal_count,
            public_crew_count=crew_count,
            public_ctf_end=ctf_end
        )

    @app.route('/api/v1/public/kill-feed', methods=['GET'])
    def public_kill_feed():
        try:
            solves = Solves.query.order_by(Solves.date.desc()).limit(5).all()
            data = []
            
            user_mode = get_config('user_mode')
            for solve in solves:
                chal = Challenges.query.filter_by(id=solve.challenge_id).first()
                chal_name = chal.name if chal else "Unknown"
                
                solver_name = "Unknown"
                if user_mode == 'teams':
                    team = Teams.query.filter_by(id=solve.team_id).first()
                    solver_name = team.name if team else "Unknown"
                else:
                    user = Users.query.filter_by(id=solve.user_id).first()
                    solver_name = user.name if user else "Unknown"
                
                # Make the date JSON serializable easily (unix timestamp)
                timestamp = int(solve.date.timestamp()) if solve.date else 0
                
                data.append({
                    "team": solver_name,
                    "challenge": chal_name,
                    "id": solve.id,
                    "time": timestamp
                })
                
            return jsonify({"success": True, "data": data})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)})
