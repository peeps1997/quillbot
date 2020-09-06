import { environment } from '../../environments/environment';
export class BackendConfig {
    public readonly API_BASE_ENDPOINT: string = 'http://localhost:3000/api/';
    public readonly SOCKEND_BASE_ENDPOINT: string = 'http://localhost:3000';

    public constructor() {
        if (environment.production) {
            this.API_BASE_ENDPOINT = 'http://botquill.herokuapp.com/api/';
            this.SOCKEND_BASE_ENDPOINT = 'http://botquill.herokuapp.com/';
        }
    }
}
