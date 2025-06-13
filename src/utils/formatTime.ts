export const parseToDate = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date;
};

export const convertToWIB = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date;
};

export const formatTime = (time: string | null) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export const formatDateWithDay = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};


