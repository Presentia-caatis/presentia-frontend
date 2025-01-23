export const formatTime = (time: string | Date): string => {
    const date = new Date(time + " UTC");
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

export const convertToWIB = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date;
};