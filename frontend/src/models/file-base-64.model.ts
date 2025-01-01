export interface IFileBase64 {
    name: string;
    content: string | ArrayBuffer | null;
    mimeType: string;
    url?: string;
    fileId?: string | number | null;
}
