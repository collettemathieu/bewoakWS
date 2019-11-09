import { Article } from './article';

type typeCourseLevel = 'Débutant' | 'Intermédiaire' | 'Expert';

export class Course {
    readonly id: string;
    articles: Article[];
    url: string;
    like: number; // Nombre de like
    userId: string; // id de l'utilisateur ayant créé le parcours
    level: typeCourseLevel; // Niveau de difficulté du parcours

    constructor(options: {
        id?: string,
        articles?: Article[],
        url?: string,
        like?: number,
        userId: string,
        level?: typeCourseLevel
    }) {
        this.id = options.id || '';
        this.articles = options.articles || [];
        this.url = options.url || '';
        this.like = options.like || 0;
        this.userId = options.userId;
        this.level = options.level || 'Débutant';
    }
}
