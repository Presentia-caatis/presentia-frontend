let getAuthUser: () => { school_id: number | null, roles: string[] } | null = () => null;

export const setAuthUserGetter = (getter: () => { school_id: number | null, roles: string[] } | null) => {
    getAuthUser = getter;
};

export const getAuthUserFromHelper = () => getAuthUser();