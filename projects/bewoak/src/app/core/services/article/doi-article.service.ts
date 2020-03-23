import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { CrossRefData } from '../../../shared/interface/cross-ref-data';

@Injectable()
export class DoiArticleService {

  public CrossRefOptions = {
    pid: '',
    format: 'unixsd'
  };
  private http: HttpClient;
  private static readonly STATUS_RESOLVED = 'resolved';

  constructor(
    private handler: HttpBackend,
    private errorService: ErrorService
  ) {
    // Requête Http sans intercepteur
    this.http = new HttpClient(this.handler);
  }

  /**
   * Retourne l'article scientifique en fonction de son identifiant DOI
   * @param doi L'identifiant DOI de l'article scientifique
   */
  public getArticle(doi: string): Observable<CrossRefData | null> {
    if (!this.idDOIValid(doi)) {
      return of(null);
    }

    const url = `${this.getBaseUrl()}pid=${this.CrossRefOptions['pid']}&format=${this.CrossRefOptions['format']}&doi=${doi}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/xml'
    });
    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      switchMap(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const status = xmlDoc.getElementsByTagName('query')[0].getAttribute('status');
        if (status === DoiArticleService.STATUS_RESOLVED) {
          return of(this.getDataFromCrossRef(xmlDoc));
        }
        return of(null);
      }),
      catchError(error => {
        return this.errorService.handleError(error);
      })
    );
  }

  /**
   * Vérifie que le DOI est valide ou non.
   * @param doi L'identifiant DOI de l'article scientifique
   */
  public idDOIValid(doi: string): boolean {
    return Boolean(doi.match('[0-9]{2}.[0-9]{4,5}/.+'));
  }

  /**
   * Spécifie les Options de l'API CrossRef
   * @param CrossRefOptions un tableau d'options
   */
  public setCrossRefOptions(options: any): void {
    this.CrossRefOptions['pid'] = options['pid'] ? options['pid'] : '';
    this.CrossRefOptions['format'] = options['format'] ? options['format'] : 'unixsd'
  }

  /**
   * Transformation des données de l'API CrossRef
   * @param xmlDoc Document XML retourné par l'API CrossRef
   */
  private getDataFromCrossRef(xmlDoc: XMLDocument): CrossRefData {
    return {
      title: xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue
    };
  }

  /**
   * Retourne l'url de base de l'API CrossRef
   */
  private getBaseUrl(): string {
    return 'http://doi.crossref.org/search/doi?';
  }
}
