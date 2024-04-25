import { Response } from 'express';

export const handleErrorResponse = (res: Response, error: any) => {
    res.status(500).json({ message: error.message });
};

export const handleNotFoundResponse = (res: Response, message: string) => {
    return res.status(404).json({ message });
};