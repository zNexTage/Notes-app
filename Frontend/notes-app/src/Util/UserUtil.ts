import User from "../Model/User";

class UserUtil {
    private USER_KEY = "user";

    SaveUserDataInCache(user: User) {
        const jsonUser: string = JSON.stringify(user);

        localStorage.setItem(this.USER_KEY, jsonUser);
    }

    GetUserFromCache() {
        const jsonUser = localStorage.getItem(this.USER_KEY);

        if (!jsonUser) {
            return null;
        }        

        const user = JSON.parse(jsonUser);

        return user;
    }

    ClearCache(){
        localStorage.removeItem(this.USER_KEY);
    }
}

export default UserUtil;