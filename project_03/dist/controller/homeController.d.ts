import { Request, Response } from 'express';
declare const _default: {
    getHomePage: (req: Request, res: Response) => Promise<void>;
    getAboutPage: (req: Request, res: Response) => void;
    getCRUD: (req: Request, res: Response) => void;
    getFindAllCRUD: (req: Request, res: Response) => Promise<void>;
    getEditCRUD: (req: Request, res: Response) => Promise<void>;
    postCRUD: (req: Request, res: Response) => Promise<void>;
    putCRUD: (req: Request, res: Response) => Promise<void>;
    deleteCRUD: (req: Request, res: Response) => Promise<void>;
};
export default _default;
