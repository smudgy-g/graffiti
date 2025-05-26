from flask import Blueprint, jsonify

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/test', methods=['GET'])
def test():
    return jsonify(data='hello, welcome to Graffiti')