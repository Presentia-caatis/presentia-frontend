export const formatSchoolName = (schoolName: string) => {
    return schoolName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
};