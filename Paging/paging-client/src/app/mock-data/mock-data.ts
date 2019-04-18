export class MockData {

    public id: number;
    public firstName: string;
    public lastNName: string;
    public email: string;
    public gender: string;
    public ipAddress: string;

    constructor(data?: any) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
