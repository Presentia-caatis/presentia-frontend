let resetSchoolCallback: (() => void) | null = null;

export const setResetSchoolCallback = (callback: () => void) => {
    resetSchoolCallback = callback;
};

export const resetSchool = () => {
    if (resetSchoolCallback) {
        resetSchoolCallback();
    }
};
