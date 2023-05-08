export const parseValueAsInt = (value: any | undefined, defaultVal: number): number => {
    if (typeof value === 'string') {
        const parsed = parseInt(value)

        if (!isNaN(parsed)) {
            return parsed
        }
    }

    return defaultVal
}
export const getStringOrDefault = (value: any | undefined, defaultVal: string): string => {
    return typeof value === 'string' ? value : defaultVal
}
