from app.model.utility import get_db

class UserDb:
    def get_user(email):
        user = get_db("SELECT id, name, email FROM member WHERE email=%s", [email], 'one')
        return user

    def check_user(email):
        check_email = get_db("SELECT email FROM member WHERE email=%s", [email], 'one')
        return check_email
        
    def create_user(name, email, password):
        register_status = get_db("INSERT INTO member (name, email, password)VALUES(%s, %s, %s)", [name, email, password], 'none')
        return register_status

    def get_login(email):
        get_user = get_db("SELECT email, password FROM member WHERE email=%s", [email], 'one')
        return get_user

    def update_password(new_password, email):
        data = get_db("UPDATE member SET password=%s WHERE email=%s", [new_password, email], 'none')
        return data