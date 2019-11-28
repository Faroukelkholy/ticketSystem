function hasPermission(userScope, scope) {

        if (userScope.length === 0) {
            return false;
        }
        for (i = 0; i < userScope.length; i++) {
            if (userScope[i] === scope) {
                return true;
            }
        }
        return false;
}

module.exports = {
    hasPermission: hasPermission
};
