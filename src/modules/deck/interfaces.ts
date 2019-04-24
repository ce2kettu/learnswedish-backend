export interface ICreateDeck {
    userId: string;
    title: string;
    description: string;
    imageUrl?: string;
    isPublic?: boolean;
}
