export type RoastResponse = {
    success: boolean;
    data?: {
        roast: string;
        spiceLevel: string;
        [key: string]: any;
    };
    message?: string;
};